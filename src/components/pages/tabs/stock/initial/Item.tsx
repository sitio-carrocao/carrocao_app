import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import useStock from '@contexts/stock'
import EValidatedProductsStatus from '@enums/validatedProductStatus'
import type IValidateProduct from '@models/ValidateProduct'
import StockService from '@services/stock/StockService'
import { useMutation } from '@tanstack/react-query'
import { Circle } from 'lucide-react-native'
import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  item: IValidateProduct
  disableButton: boolean
}

export default function StockInitialItem({ item, disableButton }: IProps) {
  const { onLoadCurrentTask, onLoadTasks } = useStock()
  const dataParsed = useMemo(() => {
    if (item?.status === EValidatedProductsStatus.Available) {
      return {
        color: theme.colors.secondary.blue,
        status: 'Disponível',
      }
    }
    if (item?.status === EValidatedProductsStatus.Completed) {
      return {
        color: theme.colors.primary.green,
        status: 'Concluído',
      }
    }
    if (item?.status === EValidatedProductsStatus.Pending) {
      return {
        color: theme.colors.secondary.yellow,
        status: 'Aguardanddo',
      }
    }
  }, [item?.status])

  const { isPending, mutateAsync, variables } = useMutation({
    mutationFn: StockService.attachAdminToValidated,
    onSuccess: async () => {
      await onLoadCurrentTask()
      await onLoadTasks()
    },
  })

  const handleAttachAdmin = useCallback(
    async (id: number) => {
      await mutateAsync({ id })
    },
    [mutateAsync]
  )

  return (
    <View style={styles.container}>
      <Texts.Bold
        style={{
          fontSize: 18,
          textAlign: 'center',
          color: theme.colors.primary.green,
        }}>
        {item.alreadyRegistered ? 'Armazenar produto' : 'Registrar produto'}
      </Texts.Bold>
      <Texts.SemiBold style={{ fontSize: 16 }}>
        Produto: {item.description}
      </Texts.SemiBold>
      <Texts.SemiBold style={{ fontSize: 16 }}>
        Quantidade: {item.quantity}
      </Texts.SemiBold>
      <Texts.SemiBold style={{ fontSize: 16 }}>
        Endereço:{' '}
        {item.suggestedAddress
          ? `${item.suggestedAddress.column} | ${item.suggestedAddress.level} ${item.suggestedAddress.deposit ? '| ' + item.suggestedAddress.deposit : ''}`
          : item.adminSuggestedAddress}
      </Texts.SemiBold>
      <View style={styles.statusContainer}>
        <Texts.SemiBold style={{ fontSize: 16 }}>Status:</Texts.SemiBold>
        <Circle color={dataParsed?.color} fill={dataParsed?.color} />
        <Texts.SemiBold style={{ fontSize: 16 }}>
          {dataParsed?.status}
        </Texts.SemiBold>
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
    rowGap: 8,
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
  },
  statusContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
})
