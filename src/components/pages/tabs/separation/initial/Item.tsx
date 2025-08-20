import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useSeparation from '@contexts/separation'
import type { InternalRequestList } from '@models/InternalRequest'
import StockService from '@services/stock/StockService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  item: InternalRequestList
  disableButton: boolean
}

export default function SeparationInitialItem({ item, disableButton }: IProps) {
  const { handleLoadingSeparation } = useSeparation()
  const queryClient = useQueryClient()

  const { isPending, mutateAsync, variables } = useMutation({
    mutationFn: StockService.attachCollaboratorToStockRequest,
    onError: () => {
      toast.show({
        message: 'Não foi possível pegar a tarefa, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: async () => {
      await handleLoadingSeparation()
      queryClient.resetQueries({
        queryKey: ['separationTasks'],
      })
      queryClient.resetQueries({
        queryKey: ['separationCurrentTask'],
      })
    },
  })

  const handleAttachAdmin = useCallback(
    async (id: number): Promise<void> => {
      await mutateAsync({ id })
    },
    [mutateAsync]
  )

  return (
    <View style={styles.container}>
      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Solicitante
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>{item.admin.name}</Texts.Bold>
      </View>

      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Data
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {format(parseISO(item.date), 'dd/MM/yyyy - HH:mm:ss')}
        </Texts.Bold>
      </View>

      <Button
        label="Pegar tarefa"
        onHandle={() => handleAttachAdmin(item.id)}
        disabled={disableButton || isPending}
        isPending={isPending && item.id === variables.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
    rowGap: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
})
