import { supabase } from "@/src/app/lib/supabase";
import { InsertTables } from "@/src/types";
import {  useQueryClient, useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = ()=>{
    const queryClient = useQueryClient();
   
     return  useMutation({
       async mutationFn(items: InsertTables<'order_items'>[]){
         const {error, data: novoProduto} = await supabase.from('order_items')
         .insert(items) 
         .select(); 
   
         if (error) {
           throw new Error(error.message);
         }
         return novoProduto; 
       }
     });
   }