import { StatusBar } from 'expo-status-bar';
import { View, Text, Platform, FlatList } from "react-native";
import { useCart } from '../providers/CartProvider';
import React from 'react';
import CartListItem from '../components/CartListItem';
import { Stack } from 'expo-router';
import Button from '../components/Button';

const CartScreen = () => {
    const {items, total} = useCart();
    return (
        <View style={{padding:10}}>
            <Stack.Screen options={{ title: 'Cartão' }} />
            <FlatList 
            data={items} 
                renderItem={({item}) => <CartListItem cartItem={item} />}
            contentContainerStyle={{gap:10}}
            />

            <Text style={{marginTop: 20, fontSize: 20, fontWeight: '500'}}>Total: ${total}</Text>
            <Button text= "Checout"/>

            <StatusBar style={Platform.OS === 'android' ? 'light' : 'auto'} />
        </View>
    );
};
 
export default CartScreen;