import EmptyList from '@assets/empty-list.png'
import InternalRequestCreateHeader from '@components/pages/tabs/internal-request/create/Header'
import InternalRequestCreateItem from '@components/pages/tabs/internal-request/create/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import { zodResolver } from '@hookform/resolvers/zod'
import type IProduct from '@models/Product'
import ProductService from '@services/product/ProductService'
import { useQuery } from '@tanstack/react-query'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

export const formInternalRequestCreateSchema = z.object({
  name: z.string(),
})

export default function TabInternalRequestCreate() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false)
  const { name = '', page = '1' } = useLocalSearchParams<{
    name: string
    page: string
  }>()

  const form = useForm<z.infer<typeof formInternalRequestCreateSchema>>({
    resolver: zodResolver(formInternalRequestCreateSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
    },
  })

  const { data, isPending, refetch } = useQuery({
    queryFn: async () => {
      const response = await ProductService.getAll({
        page: Number(page),
        name,
      })
      return response
    },
    queryKey: ['requestProducts', name, page],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formInternalRequestCreateSchema>): void => {
      router.setParams({
        name: values.name || undefined,
        page: 1,
      })
    },
    []
  )

  const handleClear = useCallback((): void => {
    form.reset({
      name: '',
    })
    router.setParams({
      name: '',
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
        <FlatList<IProduct>
          renderScrollComponent={props => (
            <KeyboardAwareScrollView {...props} />
          )}
          ListHeaderComponent={
            <InternalRequestCreateHeader
              onSubmit={form.handleSubmit(handleSubmit)}
              onClear={handleClear}
            />
          }
          ListHeaderComponentStyle={styles.headerContainer}
          contentContainerStyle={styles.contentContainer}
          data={data?.list}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <InternalRequestCreateItem item={item} />}
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
