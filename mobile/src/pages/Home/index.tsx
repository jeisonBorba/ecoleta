import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, StyleSheet, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

	useEffect(() => {
		axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
			.then(response => {
				const ufInitials = response.data.map(uf => uf.sigla); 

				setUfs(ufInitials);
			})
  }, []);  
  
	useEffect(() => {
		if (selectedUf === '0') {
			return;
		}

		axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
			.then(response => {
				const cities = response.data.map(city => city.nome);

				setCities(cities);
			})
	}, [selectedUf]);	  

  const handleNavigationToPoints = () => {
    const validateUf = selectedUf && selectedUf !== '0';
    const validateCity = selectedCity && selectedCity !== '0';

    console.log(validateUf, validateCity)

    if (!validateUf || !validateCity) {
      Alert.alert('Informações obrigatórias', 'Os campos UF e cidade devem ser informados');
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf, 
      city: selectedCity
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding': undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}  
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />

          <View>
            <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect 
            style={pickerSelect}
            onValueChange={value => setSelectedUf(value)}
            items={ufs.map(uf => ({ label: uf, value: uf }))}
            value={selectedUf} 
            placeholder={{ label: "Selecione uma UF" }}
            useNativeAndroidPickerStyle={false}
          />

          <RNPickerSelect 
            style={pickerSelect}
            onValueChange={value => setSelectedCity(value)}
            items={cities.map(city => ({ label: city, value: city }))}
            value={selectedCity} 
            placeholder={{ label: "Selecione uma cidade" }}
            useNativeAndroidPickerStyle={false}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home;

const pickerSelect = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#FFF',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 24,
    borderColor: 'gray',
    borderRadius: 10,
    color: '#6C6C80',
    marginBottom: 8
  },
  inputAndroid: {
    backgroundColor: '#FFF',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 24,
    borderColor: 'gray',
    borderRadius: 10,
    color: '#6C6C80',
    marginBottom: 8
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  pickerSelect: {
    backgroundColor: '#FFF',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 24,
    borderColor: 'gray',
    borderRadius: 10,
    color: '#6C6C80',
    marginBottom: 8 
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});