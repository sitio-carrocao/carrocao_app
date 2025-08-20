import EmptyList from '@assets/empty-list.png'
import SeparationInitialCurrentTask from '@components/pages/tabs/separation/initial/CurrentTask'
import SeparationInitialItem from '@components/pages/tabs/separation/initial/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import type { InternalRequestList } from '@models/InternalRequest'
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

export default function TabSeparationInitial() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  const {
    data,
    isPending: isPendingGetAll,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const response = await StockService.getAllInternalRequest({
        status: EInternalRequestStatus.WaitingForSeparation,
      })
      return response
    },
    queryKey: ['separationTasks'],
    refetchOnWindowFocus: false,
  })

  const {
    data: currentTask,
    refetch: refetchCurrentTask,
    isPending: isPendingStockRequest,
  } = useQuery({
    queryFn: async () => {
      const response = await StockService.stockRequestVerifyTask()
      return response
    },
    queryKey: ['separationCurrentTask'],
    refetchOnWindowFocus: false,
  })

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await refetch()
    await refetchCurrentTask()
    setIsRefresh(false)
  }, [refetch, refetchCurrentTask])

  return (
    <View style={styles.container}>
      <FlatList<InternalRequestList>
        onRefresh={onRefresh}
        refreshing={isRefresh}
        ListHeaderComponent={
          <View>
            {currentTask && (
              <SeparationInitialCurrentTask
                data={currentTask ? currentTask : null}
              />
            )}
            {!isPendingGetAll &&
              !isPendingStockRequest &&
              data?.list.length && (
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
        ListEmptyComponent={
          !data?.list.length && (isPendingGetAll || isPendingStockRequest) ? (
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
        contentContainerStyle={styles.contentContainer}
        data={data?.list}
        renderItem={({ item }) => (
          <SeparationInitialItem disableButton={!!currentTask} item={item} />
        )}
      />
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
