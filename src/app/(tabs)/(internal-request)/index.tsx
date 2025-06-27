import EmptyList from '@assets/empty-list.png'
import InternalRequestInitialHeader from '@components/pages/tabs/internal-request/initial/Header'
import InternalRequestInitialItem from '@components/pages/tabs/internal-request/initial/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import { zodResolver } from '@hookform/resolvers/zod'
import type { InternalRequestList } from '@models/InternalRequest'
import StockService from '@services/stock/StockService'
import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native'
import { z } from 'zod'

export const formInternalRequestInitialSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  status: z.nativeEnum(EInternalRequestStatus).optional(),
})

export default function TabInternalRequestInitial() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false)
  const {
    endDate = format(new Date(), 'yyyy-MM-dd'),
    startDate = format(new Date(), 'yyyy-MM-dd'),
    status,
    page = '1',
  } = useLocalSearchParams<{
    endDate: string
    startDate: string
    status: EInternalRequestStatus
    page: string
  }>()
  const form = useForm<z.infer<typeof formInternalRequestInitialSchema>>({
    resolver: zodResolver(formInternalRequestInitialSchema),
    mode: 'onBlur',
    defaultValues: {
      endDate: format(new Date(), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const { data, isPending, refetch } = useQuery({
    queryFn: async () => {
      const response = await StockService.getAllCollaboratorInternalRequest({
        rowsPerPage: 20,
        page: Number(page),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        startDate: format(subDays(new Date(), 100), 'yyyy-MM-dd'),
        status,
      })
      return response
    },
    queryKey: ['internalRequest', endDate, startDate, status, page],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formInternalRequestInitialSchema>): void => {
      router.setParams({
        status: values.status || undefined,
        page: 1,
        endDate: values.endDate,
        startDate: values.startDate,
      })
    },
    []
  )

  const handleClear = useCallback((): void => {
    form.reset({
      endDate: format(new Date(), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      status: undefined,
    })
    router.setParams({
      status: undefined,
      endDate: format(new Date(), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      page: 1,
    })
  }, [form])

  const handlePagination = useCallback((): void => {
    router.setParams({ page: data?.pagination.current! + 1 || 1 })
  }, [data])

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await refetch()
    setIsRefresh(false)
  }, [refetch])

  return (
    <View style={styles.container}>
      <FormProvider {...form}>
        <FlatList<InternalRequestList>
          ListHeaderComponent={
            <InternalRequestInitialHeader
              onSubmit={form.handleSubmit(handleSubmit)}
              onClear={handleClear}
            />
          }
          ListHeaderComponentStyle={styles.headerContainer}
          contentContainerStyle={styles.contentContainer}
          data={data?.list}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <InternalRequestInitialItem item={item} />}
          stickyHeaderHiddenOnScroll
          stickyHeaderIndices={[0]}
          onRefresh={onRefresh}
          refreshing={isRefresh}
          ListFooterComponent={
            data?.pagination.total !== 0 &&
            data?.pagination.current !== data?.pagination.total ? (
              <ActivityIndicator
                color={theme.colors.primary.green}
                size="large"
              />
            ) : undefined
          }
          onEndReached={
            data?.pagination.total !== 0 &&
            data?.pagination.current !== data?.pagination.total
              ? handlePagination
              : undefined
          }
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            !data?.list.length && isPending ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator
                  color={theme.colors.primary.green}
                  size={80}
                />
                <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
                  Carregando...
                </Texts.Bold>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Image style={styles.emptyImage} source={EmptyList} />
                <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
                  Nenhuma solicitação encontrada
                </Texts.Bold>
              </View>
            )
          }
        />
      </FormProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
  contentContainer: {
    padding: 16,
    rowGap: 16,
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: theme.colors.background.general,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 250,
    height: 250,
  },
})
