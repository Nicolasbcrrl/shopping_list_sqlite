import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import * as SQLite from'expo-sqlite';
import { useState, useEffect} from 'react';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [listProd, setListProd] = useState([]);
  const db = SQLite.openDatabase('listdb.db');
  
  useEffect(() => {  
    db.transaction(tx => {    
      tx.executeSql('create table if not exists shop (id integer primary key not null, product text, amount text);');  
    }, ()=>console.log('Impossible to create or access to the table'), updateList);
  }, []);

  const saveItem = () => {
    if(product !== '' && amount !== '') {
      db.transaction(tx => {
        tx.executeSql('insert into shop (product, amount) values (?, ?);', [product, amount]);
      }, ()=>console.log('Impossible to save the product and the amount'), updateList);
    } else {
      Alert.alert('Please, fill the fields');
    }
  }
//mettre la liste à jour dans la table shopList en sqlite
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shop;', [], (_, { rows }) =>
        setListProd(rows._array)
      );  
    }, ()=>console.log('An error has occurred when we selected all the data'), null);
  } 


  const deleteItem = (id) => {  
    db.transaction(tx => {
      tx.executeSql('delete from shop where id = ?;', [id]);
    }, ()=> console.log('An error has occured when we selected all the data'), updateList); 
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.textInputStyle}
        placeholder='Product'
        onChangeText={value => setProduct(value)}
        value={product}
      />

      <TextInput
        style={styles.textInputStyle}
        placeholder='Amount'
        onChangeText={value => setAmount(value)}
        value={amount}
      />

      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', width: '75%' }}>
        <Button
            style={styles.buttonStyle}
            title="Save"
            onPress={saveItem}
        />
      </View>
      

      <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', margin: 20 }}>
        <Text style= {{ color: 'blue', fontSize: 16, fontWeight: 'bold' }} >Shopping List</Text>
        <FlatList
            data={listProd}
            renderItem={({item}) =>
              <View style={styles.listContainer}>
                <Text>{item.product}, {item.amount}</Text>
                <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Bought</Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%'
  },
  inputStyle:{
    width:200,
    borderColor:'gray',
    borderWidth:1, 
    fontSize: 20
  },
  vue: {
    //mettre en page les trois vues dans la vues principale
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%' 
  },
  buttonStyle: {
    width: 10,
    height: 10,
    margin: 20,
    alignContent: 'center',
  },
  textInputStyle: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin:10
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});
