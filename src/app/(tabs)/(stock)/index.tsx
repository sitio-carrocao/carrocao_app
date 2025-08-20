import EmptyList from '@assets/empty-list.png'
import StockInitialCurrentTask from '@components/pages/tabs/stock/initial/CurrentTask'
import StockInitialItem from '@components/pages/tabs/stock/initial/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type IValidateProduct from '@models/ValidateProduct'
import StockService from '@services/stock/StockService'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native'

export default function TabStockInitial() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  const {
    data,
    isPending,
    refetch: refetchProducts,
  } = useQuery({
    queryFn: async () => {
      const response = await StockService.getValidatedProducts()
      return response
    },
    queryKey: ['validatedProducts'],
    refetchOnWindowFocus: false,
  })

  const {
    data: details,
    isPending: isPendingDetails,
    refetch: refetchDetails,
  } = useQuery({
    queryFn: async () => {
      const response = await StockService.getValidatedProductDetails()
      return response
    },
    queryKey: ['validatedProductDetails'],
    refetchOnWindowFocus: false,
  })

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await refetchProducts()
    await refetchDetails()
    setIsRefresh(false)
  }, [refetchDetails, refetchProducts])

  return (
    <View style={styles.container}>
      <FlatList<IValidateProduct>
        ListHeaderComponent={
          <View>
            {details && <StockInitialCurrentTask data={details} />}
            {!isPending && !isPendingDetails && data?.list.length && (
              <Texts.Bold
                style={{
                  fontSize: 24,
                  color: theme.colors.primary.green,
                }}>
                Tarefas
              </Texts.Bold>
            )}
          </View>
        }
        contentContainerStyle={styles.contentContainer}
        data={data?.list}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <StockInitialItem disableButton={!!details} item={item} />
        )}
        onRefresh={onRefresh}
        refreshing={isRefresh}
        ListEmptyComponent={
          !data?.list.length && (isPending || isPendingDetails) ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={theme.colors.primary.green} size={80} />
              <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
                Carregando...
              </Texts.Bold>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Image style={styles.emptyImage} source={EmptyList} />
              <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
                Nenhuma tarefa encontrada
              </Texts.Bold>
            </View>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
