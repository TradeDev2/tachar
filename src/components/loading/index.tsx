import React from 'react';
import Lottie from 'lottie-react-native';
import { LoadingScreen } from '../../styled';

export default function Loading() {
  return (
    <LoadingScreen>
      <Lottie source={require('../../json/loading.json')} autoPlay loop />
    </LoadingScreen>
  );
}