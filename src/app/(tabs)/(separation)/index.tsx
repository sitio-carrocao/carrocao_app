import EmptyList from '@assets/empty-list.png'
import SeparationInitialCurrentTask from '@components/pages/tabs/separation/initial/CurrentTask'
import SeparationInitialItem from '@components/pages/tabs/separation/initial/Item'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import type { InternalRequestList } from '@models/InternalRequest'
import type ISeparationTask from '@models/SeparationTask'
import StockService from '@services/stock/StockService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export default function TabSeparationInitial() {
  const queryClient = useQueryClient()
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
    retryOnMount: false,
  })

  const {
    data: currentTask,
    refetch: refetchCurrentTask,
    isPending: isPendingStockRequest,
  } = useQuery({
    queryFn: async () => {
      const response = await StockService.getStockRequestDetails()
      return response
    },
    queryKey: ['separationCurrentTask'],
    refetchOnWindowFocus: false,
  })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.attachCollaboratorToStockRequest,
    onError: () => {
      toast.show({
        message: 'Não foi possível pegar a tarefa, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['separationTasks'],
      })
      queryClient.resetQueries({
        queryKey: ['separationCurrentTask'],
      })
    },
  })

  const handleAttachEmployee = useCallback(async (): Promise<void> => {
    await mutateAsync()
  }, [mutateAsync])

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await refetch()
    await refetchCurrentTask()
    setIsRefresh(false)
  }, [refetch, refetchCurrentTask])

  return (
    <>
      {isPending || isPendingStockRequest ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={theme.colors.primary.green} size={80} />
          <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
            Carregando...
          </Texts.Bold>
        </View>
      ) : (
        <View style={styles.container}>
          {!currentTask && !isPendingStockRequest && !!data?.list.length && (
            <View style={styles.headerContainer}>
              <View style={styles.headerInfoContainer}>
                <Texts.SemiBold
                  style={{
                    fontSize: 16,
                    color: theme.colors.background.general,
                  }}>
                  Existem tarefas pendentes
                </Texts.SemiBold>
                <TouchableOpacity
                  onPress={handleAttachEmployee}
                  activeOpacity={theme.button.activeOpacity}
                  style={styles.headerButton}>
                  <Texts.SemiBold
                    style={{ color: theme.colors.background.general }}>
                    Pegar tarefa
                  </Texts.SemiBold>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <FlatList<InternalRequestList>
            onRefresh={onRefresh}
            refreshing={isRefresh}
            ListHeaderComponent={
              <View>
                <SeparationInitialCurrentTask data={currentTask} />
                {!isPendingGetAll && (
                  <Texts.Bold
                    style={{
                      fontSize: 24,
                      color: theme.colors.primary.green,
                    }}>
                    Tarefas disponíveis
                  </Texts.Bold>
                )}
              </View>
            }
            ListEmptyComponent={
              !data?.list.length && isPendingGetAll ? (
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
                    Nenhuma tarefa encontrada
                  </Texts.Bold>
                </View>
              )
            }
            contentContainerStyle={styles.contentContainer}
            data={data?.list}
            renderItem={({ item }) => <SeparationInitialItem item={item} />}
          />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
  headerContainer: {
    padding: 16,
  },
  headerButton: {
    borderWidth: 1,
    borderColor: theme.colors.background.general,
    padding: 8,
    borderRadius: 8,
  },
  headerInfoContainer: {
    backgroundColor: theme.colors.secondary.purple,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
