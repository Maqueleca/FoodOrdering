import { FlatList, ActivityIndicator } from 'react-native';
import { Text} from '@/src/components/Themed';
import ProductListItem from '@/src/components/ProductListItem';
import React from 'react';
 import { useProductList } from '@/src/api/products';

 
export default function MenuScreen() {

  const {data: produto, error, isLoading} = useProductList(); 

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Falhou em buscar produtos</Text>
  }

  return (
  <FlatList 
    data={produto}
    renderItem={({item})=> <ProductListItem product={item}/>}
    numColumns={2}
    contentContainerStyle={{gap:10, padding:10}}
    columnWrapperStyle={{gap:10}}
  />

);
}

