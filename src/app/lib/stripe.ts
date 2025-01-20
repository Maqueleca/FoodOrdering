import { Alert } from "react-native";
import { supabase } from "./supabase";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async (amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-sheet', {
        body: { amount },
      });
  
      if (error || !data) {
        Alert.alert('Erro ao buscar parâmetros', `${error?.message ?? 'Resposta inválida do servidor'}`);
        return {};
      }
  
      return data;
    } catch (err) {
      Alert.alert('Erro', 'Falha ao se comunicar com o servidor');
      return {};
    }
  };  
  
  export const initialisePaymentSheet = async (amount: number) => {
    try {
      const { paymentIntent, publishableKey } = await fetchPaymentSheetParams(amount);

      console.log({ paymentIntent, publishableKey });
  
      if (!publishableKey || !paymentIntent) {
        Alert.alert('Erro', 'Não foi possível inicializar o Payment Sheet. Verifique os parâmetros.');
        return false; 
      }
  
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Flavor Bridge, Comp.',
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: 'Teresa Glória',
        },
      });
  
      if (error) {
        Alert.alert('Erro', `Falha ao inicializar o Payment Sheet: ${error.message}`);
        return false;
      }
  
      return true;
    } catch (err) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado durante a inicialização.');
      return false;
    }
  };
  
  
  export const openPaymentSheet = async (amount: number) => {
    const isInitialized = await initialisePaymentSheet(amount);
  
    if (!isInitialized) {
      Alert.alert('Erro', 'Não foi possível abrir o Payment Sheet. Inicialização falhou.');
      return false;
    }
  
    const { error } = await presentPaymentSheet();
  
    if (error) {
      Alert.alert(`Código de Erro: ${error.code}`, error.message);
      return false;
    } else {
      Alert.alert('Sucesso', 'Seu pedido está confirmado!');
      return true;
    }
  };
  