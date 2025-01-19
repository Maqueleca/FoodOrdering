import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import OrderListItem from '@/src/components/OrderListItem';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import { useOrderDetails } from '@/src/api/orders';
import { useUpadteOrderSubscription } from '@/src/api/orders/subscription';

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])

  const { data: order, error, isLoading } = useOrderDetails(id);
  useUpadteOrderSubscription(id);

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Produto não Encontrado</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Pedido #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        contentContainerStyle={{ gap: 10 }}
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