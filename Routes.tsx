import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/screens/home';
import { Login } from './src/screens/login';
import { Cadastro } from './src/screens/cadastro';
import { CadastroFotos } from './src/screens/cadastroFotos';

const Stack = createNativeStackNavigator();

export default function Routes() {

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar_Senha" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro_Fotos" component={CadastroFotos} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

