import { Stack } from "expo-router";
import React from "react";;

export default function OrdesStack() {
  // return <Stack />;
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: "Pedidos"
      }}/>
    </Stack>
  );

}