import { ActivityIndicator, FlatList, Text } from 'react-native';
import React, { useEffect } from 'react';
import OrderListItem from '@/src/components/OrderListItem';
import { useAdminOrderList } from '@/src/api/orders';
import { supabase } from '@/src/app/lib/supabase';
import { useInsertOrderSubscription } from '@/src/api/orders/subscription';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useAdminOrderList({archived: false});
  useInsertOrderSubscription();
  
  if (isLoading) {
  return <ActivityIndicator />;
}
if (error) {
  return <Text>Failed to fetch</Text>;
}
  return (
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
  );
}