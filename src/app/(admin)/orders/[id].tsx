import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import OrderListItem from '@/src/components/OrderListItem';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import { useOrderDetails, useUpdateOrder } from '@/src/api/orders';
import Colors from '@/src/constants/Colors';
import { OrderStatusList } from '@/src/types';

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])

  const { data: order, error, isLoading } = useOrderDetails(id);
  const {mutate: updateOrder} = useUpdateOrder();

  const  updateStatus = (status)=>{
    updateOrder({
      id: id,
      updatedFields: {status}
    })
  };

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Produto não Encontrado</Text>
  }

  if (!order) {
    return <Text>Produto não Encontrado</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Pedido #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: 'bold' }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? 'white' : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

export default OrderDetailScreen;