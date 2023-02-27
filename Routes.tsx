import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IRoutes } from './src/interfaces/IRoutes';

import { HomeScreen } from './src/screens/home';
import { Login } from './src/screens/login';
import { Cadastro } from './src/screens/cadastro';
import { CadastroFotos } from './src/screens/cadastroFotos';
import { Acertos } from './src/screens/acertos';
import { Acertos_Detalhes } from './src/screens/acertosDetalhes';
import { Parcelas_Aberto } from './src/screens/parcelasAberto';
import { Pedidos } from './src/screens/pedidos';
import { Catalogo } from './src/screens/catalogo';
import { Minhas_Vendas } from './src/screens/minhasVendas';
import { Meus_Rendimentos } from './src/screens/meusRendimentos';
import { Recuperar_Senha } from './src/screens/recuperarSenha';

const Stack = createNativeStackNavigator<IRoutes>();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar_Senha" component={Recuperar_Senha} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro_Fotos" component={CadastroFotos} options={{ headerShown: false }} />
      <Stack.Screen name="Acertos" component={Acertos} options={{ headerShown: false }} />
      <Stack.Screen name="Acertos_Detalhes" component={Acertos_Detalhes} options={{ headerShown: false }} />
      <Stack.Screen name="Parcelas_Aberto" component={Parcelas_Aberto} options={{ headerShown: false }} />
      <Stack.Screen name="Pedidos" component={Pedidos} options={{ headerShown: false }} />
      <Stack.Screen name="Catalogo" component={Catalogo} options={{ headerShown: false }} />
      <Stack.Screen name="Minhas_Vendas" component={Minhas_Vendas} options={{ headerShown: false }} />
      <Stack.Screen name="Meus_Rendimentos" component={Meus_Rendimentos} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

