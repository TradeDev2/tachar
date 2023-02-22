import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IRoutes } from './src/interfaces/IRoutes';

import { HomeScreen } from './src/screens/home';
import { Login } from './src/screens/login';
import { Cadastro } from './src/screens/cadastro';
import { CadastroFotos } from './src/screens/cadastroFotos';
import { Acertos } from './src/screens/acertos';

const Stack = createNativeStackNavigator<IRoutes>();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar_Senha" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro_Fotos" component={CadastroFotos} options={{ headerShown: false }} />
      <Stack.Screen name="Acertos" component={Acertos} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

