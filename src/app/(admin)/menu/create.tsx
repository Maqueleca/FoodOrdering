import Button from "@/src/components/Button";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import Colors from "@/src/constants/Colors";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from "expo-router";

const CreateProcutScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErros] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { id } = useLocalSearchParams();
    const isUpdating = !!id;

    const resetFields = () => {
        setName('');
        setPrice('');
    };

    const validateInput = () => {
        if (!name) {
            setErros('Nome é required');
            return false;
        }
        if (!price) {
            setErros('Preço é required');
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setErros('Preço não é um número');
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate();
        } else {
            onCreate();
        }
    }

    const onUpdate = () => {
        setErros('');
        if (!validateInput()) {
            return;
        }

        console.warn('updating product: ', name);

        resetFields();
    };

    const onCreate = () => {
        setErros('');
        if (!validateInput()) {
            return;
        }

        console.warn('Creating product: ', name);

        resetFields();
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        } else {
            //alert('You did not select any image.');
        }
    };
    const onDelete = () => {
        console.warn('DELETE!!!!');
    };
    const confirmDelete = () => {
        Alert.alert('Confirma', 'Deseja realmente apagar esse produto?',
            [{
                text: 'Cancelar',
            },
            {
                text: 'Apagar',
                style: "destructive",
                onPress: onDelete,
            },
            ]
        )
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? "Actulizar produto" : "Criar Produto" }} />
            <Image source={{ uri: selectedImage || defaultPizzaImage }} style={styles.image} />
            <Text onPress={pickImage} style={styles.txtButton}>Selecione uma Imagem</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name" style={styles.input} />

            <Text style={styles.label}>Preço ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="9.99" style={styles.input}
                keyboardType="numeric" />

            <Text style={{ color: 'red' }}>{errors}</Text>
            <Button onPress={onSubmit} text={isUpdating ? "Actualizar" : "Criar"} />
            {isUpdating && <Text onPress={confirmDelete} style={styles.cancelButton}>Delete</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
        borderRadius: 100
    },
    txtButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
    cancelButton: {
        fontSize: 17,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 10,
    },
    label: {
        color: 'gray',
        fontSize: 16
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    }
});

export default CreateProcutScreen;
