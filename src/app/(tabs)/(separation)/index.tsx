import EmptyList from '@assets/empty-list.png'
import SeparationInitialCurrentTask from '@components/pages/tabs/separation/initial/CurrentTask'
import SeparationInitialItem from '@components/pages/tabs/separation/initial/Item'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import useSeparation from '@contexts/separation'
import type { InternalRequestList } from '@models/InternalRequest'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native'

export default function TabSeparationInitial() {
  const {
    currentTask,
    tasksLists,
    onLoadCurrentTask,
    onLoadTasks,
    isLoadingCurrentTask,
    isLoadingTaskList,
  } = useSeparation()
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  const onRefresh = useCallback(async () => {
    setIsRefresh(true)
    await onLoadTasks()
    await onLoadCurrentTask()
    setIsRefresh(false)
  }, [onLoadTasks, onLoadCurrentTask])

  return (
    <View style={styles.container}>
      <FlatList<InternalRequestList>
        onRefresh={onRefresh}
        refreshing={isRefresh}
        ListHeaderComponent={
          <View>
            {!!currentTask && (
              <SeparationInitialCurrentTask data={currentTask} />
            )}
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
        contentContainerStyle={styles.contentContainer}
        data={tasksLists}
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
