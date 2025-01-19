import { supabase } from "@/src/app/lib/supabase";
import { useEffect } from "react";
import {  useQueryClient } from "@tanstack/react-query";

export const useInsertOrderSubscription = ()=>{
    const queryClient = useQueryClient();
    useEffect(() => {
        const orders = supabase
          .channel('custom-insert-channel')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'orders' },
            (payload) => {
              queryClient.invalidateQueries(['orders']);
              //refetch();
            }
          )
          .subscribe();
        return () => {
          orders.unsubscribe();
        };
      }, []);
}

export const useUpadteOrderSubscription =(id: number)=>{
    const queryClient = useQueryClient();
    
    useEffect(() => {
        const orders = supabase
          .channel('custom-filter-channel')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${id}`,
            },
            (payload) => {
                queryClient.invalidateQueries(['orders', id]);
             // refetch();
             
            }
          )
          .subscribe();
      
        return () => {
          orders.unsubscribe();
        };
      }, []);
}