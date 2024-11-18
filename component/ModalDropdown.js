import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const ModalDropdown = ({ selectedValue, onValueChange, items }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{flexDirection: "row"}}>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.dropdownButton}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
             <Text>{selectedValue}</Text>
             <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </View>
       
       
      </TouchableOpacity>

      <Modal transparent={true} visible={visible} animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  onValueChange(item.value);
                  setVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    paddingVertical: 10,
  },
});

export default ModalDropdown;
