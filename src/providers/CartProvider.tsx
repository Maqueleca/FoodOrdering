import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CartItem, Tables } from "../types";
import React from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";
import { initialisePaymentSheet, openPaymentSheet } from "../app/lib/stripe";
import { Alert } from "react-native";

type Product = Tables<'product'>;

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amout: -1 | 1) => void;
    total: number;
    checkout: () => void;
};

export const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0,
    checkout: () => { },
});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const router = useRouter();

    const addItem = (product: Product, size: CartItem['size']) => {
        const existingItem = items.find(item => item.product == product && item.size == size);

        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1
        };
        setItems([newCartItem, ...items]);
    };

    const updateQuantity = (itemId: string, amout: -1 | 1) => {
        setItems(
            items.map(item =>
                item.id != itemId
                    ? item
                    : { ...item, quantity: item.quantity + amout }
            ).filter((item) => item.quantity > 0)
        );
    };

    const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity),
        0
    );

    const clearCart = () => {
        setItems([]);
    }

    const checkout = async () => {

        console.log("clicou")

        try {
            // Inicialize o Payment Sheet
            const isInitialized = await initialisePaymentSheet(Math.floor(total * 100)); // Converte o total para centavos

            if (!isInitialized) {
                Alert.alert('Erro', 'Falha ao inicializar o Payment Sheet.');
                return;
            }

            // Abra o Payment Sheet
            const payed = await openPaymentSheet(Math.floor(total * 100));

            if (!payed) {
                Alert.alert('Pagamento não realizado', 'A transação foi cancelada ou falhou.');
                return;
            }

            // Insira o pedido após o pagamento bem-sucedido
            insertOrder(
                { total },
                {
                    onSuccess: saveOrderItems, // Salva os itens do pedido após o sucesso
                }
            );


            Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro durante o processo de checkout.');
            console.error(error); // Log de erros para debug

        }

    };


    const saveOrderItems = (order: Tables<'orders'>) => {
        const orderItems = items.map((cartItem) => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size
        }));

        insertOrderItems(orderItems,
            {
                onSuccess() {
                    clearCart();
                    router.push(`/(user)/orders/${order.id}`);
                }
            }
        )


    }

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
