import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import { useState } from "react";
import Button from '@/src/components/Button';
import { useCart } from '@/src/providers/CartProvider';
import { PizzaSize } from '@/src/types';
import React from 'react';
import { useProduct } from '@/src/api/products';
import RemoteImage from '@/src/components/remoteImage';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

    const { data: produto, error, isLoading } = useProduct(id);
    const { addItem } = useCart();
    const router = useRouter();

    const addToCart = () => {
        if (!produto) {
            return;
        }
        addItem(produto, selectedSize);
        router.push('/cart');
    };

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Produto não Encontrado</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: produto?.name }} />

            <RemoteImage
                path={produto?.image}
                fallback={defaultPizzaImage} 
                style={styles.image}
            />

            <Text style={{ marginLeft: 10 }}>Selecione o Tamanho</Text>

            <View style={styles.sizes}>
                {sizes.map(size => (
                    <Pressable
                        onPress={() => setSelectedSize(size)}
                        style={[
                            styles.size,
                            { backgroundColor: selectedSize === size ? 'gainsboro' : 'white' }
                        ]}
                        key={size}
                    >
                        <Text
                            style={[
                                styles.sizeText,
                                { color: selectedSize === size ? 'black' : 'gray' }
                            ]}
                        >
                            {size}
                        </Text>
                    </Pressable>
                ))}
            </View>

    

            <Text style={styles.price}>{produto?.price}, kz</Text>
            <Button onPress={addToCart} text='Add ao Carrinho' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: '35%'
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    size: {
        backgroundColor: 'gainsboro',
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizeText: {
        fontSize: 20,
        fontWeight: '500'
    }
});

export default ProductDetailsScreen;