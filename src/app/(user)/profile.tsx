import { View, Text, Button } from 'react-native';
import React from 'react';
import { supabase } from '../lib/supabase';

const ProfileScreen = () => {
  return (
    <View>
      <Button
        onPress={()=> supabase.auth.signOut()}
        title="Terminar Secção"
      />
    </View>
  );
};

export default ProfileScreen;