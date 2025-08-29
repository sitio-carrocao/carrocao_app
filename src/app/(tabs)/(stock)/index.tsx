import EmptyList from '@assets/empty-list.png'
import StockInitialCurrentTask from '@components/pages/tabs/stock/initial/CurrentTask'
import StockInitialItem from '@components/pages/tabs/stock/initial/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import useSession from '@contexts/session'
import useStock from '@contexts/stock'
import type IValidateProduct from '@models/ValidateProduct'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native'

export default function TabStockInitial() {
  const { code } = useSession()
  const {
    currentTask,
    tasksLists,
    onLoadCurrentTask,
    onLoadTasks,
    isLoadingCurrentTask,
    isLoadingTaskList,
  } = useStock()
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await onLoadTasks()
    await onLoadCurrentTask()
    setIsRefresh(false)
  }, [onLoadTasks, onLoadCurrentTask])

  return (
    <View style={styles.container}>
      <FlatList<IValidateProduct>
        ListHeaderComponent={
          <View>
            {!!currentTask && <StockInitialCurrentTask data={currentTask} />}
            {!isLoadingTaskList &&
              !isLoadingCurrentTask &&
              !!tasksLists.length && (
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
        data={
          code !== '0001'
            ? tasksLists.filter(item => item.alreadyRegistered)
            : tasksLists
        }
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <StockInitialItem disableButton={!!currentTask} item={item} />
        )}
        onRefresh={onRefresh}
        refreshing={isRefresh}
        ListEmptyComponent={
          !tasksLists.length && (isLoadingTaskList || isLoadingCurrentTask) ? (
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
