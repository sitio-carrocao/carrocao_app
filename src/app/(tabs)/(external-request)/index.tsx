import EmptyList from '@assets/empty-list.png'
import ExternalRequestInitialItem from '@components/pages/tabs/external-request/initial/Item'
import InternalRequestInitialHeader from '@components/pages/tabs/internal-request/initial/Header'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EExternalRequestStatus from '@enums/externalRequestStatus'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ExternalRequestList } from '@models/ExternalRequest'
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

export const formExternalRequestInitialSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.nativeEnum(EExternalRequestStatus).optional(),
})

export default function TabExternalRequestInitial() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false)
  const {
    endDate = format(new Date(), 'yyyy-MM-dd'),
    startDate = format(new Date(), 'yyyy-MM-dd'),
    status,
    page = '1',
    name,
  } = useLocalSearchParams<{
    endDate: string
    startDate: string
    status: EExternalRequestStatus
    page: string
    name: string
  }>()
  const form = useForm<z.infer<typeof formExternalRequestInitialSchema>>({
    resolver: zodResolver(formExternalRequestInitialSchema),
    mode: 'onBlur',
    defaultValues: {
      endDate: format(new Date(), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const { data, isPending, refetch } = useQuery({
    queryFn: async () => {
      const response = await StockService.getAllCollaboratorExternalRequest({
        rowsPerPage: 20,
        page: Number(page),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        startDate: format(subDays(new Date(), 100), 'yyyy-MM-dd'),
        status,
        name,
      })
      return response
    },
    queryKey: ['externalRequest', endDate, startDate, status, page, name],
    refetchOnWindowFocus: false,
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formExternalRequestInitialSchema>): void => {
      router.setParams({
        status: values.status || undefined,
        page: 1,
        endDate: values.endDate,
        startDate: values.startDate,
        name: values.name || undefined,
      })
    },
    []
  )

  const handleClear = useCallback((): void => {
    form.reset({
      endDate: format(new Date(), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      status: undefined,
      name: '',
    })
    router.setParams({
      status: undefined,
      name: undefined,
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
    <View style={styles.conatiner}>
      <FormProvider {...form}>
        <FlatList<ExternalRequestList>
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
          renderItem={({ item }) => <ExternalRequestInitialItem item={item} />}
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
  conatiner: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    rowGap: 16,
    flexGrow: 1,
    backgroundColor: theme.colors.background.general,
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
