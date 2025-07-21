import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import Feather from '@expo/vector-icons/Feather';
import email from '../assets/settings_icons/email.png'
import share from '../assets/settings_icons/share.png'
import file from '../assets/settings_icons/file-search-02.png'
import changeLineNotification from '../assets/settings_icons/bank-note-02.png'
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  countryFlag: string;
  showLogoutModal: () => void;
  showDeleteModal: () => void; 
};

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, countryFlag, showLogoutModal, showDeleteModal }) => {
  const [screen, setScreen] = useState<'main' | 'betTypes' | 'lineChange'>('main');
  const [selectedBetValue, setSelectedBetValue] = useState<string[]>([]);
  const betOptions = [ 'Player Props', 'Head to Head/Moneyline', 'Spreads', 'Alternate Spreads', ];
  const lineChangesOptions = [ '5-10% Line Changes', '10-20% Line Changes', '30%+ Line Changes', '40%+ Line Changes' ]

  const [fontsLoaded] = useFonts({
    'SFProDisplayRegular': require('../assets/fonts/SFProDisplayRegular.otf'),
    'SFProDisplayBold': require('../assets/fonts/SFProDisplayBold.otf'),
    'RobotoBold': require('../assets/fonts/Roboto-Bold.ttf'),
    'WorkSansRegular': require('../assets/fonts/WorkSans-Regular.ttf'),
    'WorkSansSemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
    'RobotoRegular': require('../assets/fonts/Roboto-Regular.ttf'),
    'RobotoSemiBold': require('../assets/fonts/Roboto-SemiBold.ttf'),
    'RobotoLight': require('../assets/fonts/Roboto-Light.ttf'),
    'InterRegular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'BunkenTech': require('../assets/fonts/BunkenTechSansPro-ExBdIt.ttf'),
    'DMSansBold': require('../assets/fonts/DMSans_24pt-Bold.ttf'),
    'DMSansLight': require('../assets/fonts/DMSans_18pt-Light.ttf'),
    'InterBold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
    'InterSemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
  });

  const handleClose = () => {
    setScreen('main');
    onClose(); 
  };

  const toggleOption = (option: string) => {
    setSelectedBetValue((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  if (!fontsLoaded) return null;
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={12} tint="dark" style={styles.backdrop}>
          {screen === 'main' ? (
            <View style={styles.settingsModalContainer}>
              {/* Close icon */}
              <TouchableOpacity onPress={handleClose} style={styles.closeIconSettingsModal}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>

              {/* Menu options */}
              <View style={styles.menuOptions}>
                <TouchableOpacity style={styles.row}>
                  <Image source={email} />
                  <Text style={styles.rowText}>Email Us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row}>
                  <Image source={share} />
                  <Text style={styles.rowText}>Share App</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={() => setScreen('betTypes')}>
                  <Image source={changeLineNotification} />
                  <Text style={styles.rowText}>Change Line Change Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row}>
                <Text style={styles.flagIcon}>{countryFlag}</Text>
                  <Text style={styles.rowText}>Modify Markets Displayed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row}>
                  <Image source={file} />
                  <Text style={styles.rowText}>Plan Details</Text>
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={showLogoutModal}><Text style={styles.logoutButtonText}>Log Out</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={showDeleteModal}><Text style={styles.deleteButtonText}>Delete Account</Text></TouchableOpacity>
              </View>
            </View>
          ) : screen === 'betTypes' ? (
            <View style={styles.questionsModalContainer}>
              {/* Top row */}
              <View style={styles.topRow}>
                  {/* Back icon */}
                  <TouchableOpacity onPress={() => setScreen('main')}>
                      <Ionicons name="chevron-back" size={24} color="white" style={styles.closeIconQuestionsModal} />
                  </TouchableOpacity>

                  {/* Close icon */}
                  <TouchableOpacity onPress={handleClose}>
                      <Feather name="x" size={24} color="white" style={styles.closeIconQuestionsModal} />
                  </TouchableOpacity>
              </View>

              <Text style={styles.title}>What types of bets do you want to be notified about?</Text>
              <Text style={styles.text}>You can choose more than 1</Text>

              {betOptions.map((option) => { 
                  const isSelected = selectedBetValue.includes(option);
                  return (
                      <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={[styles.optionButton, selectedBetValue.includes(option) && styles.optionButtonSelected]}>
                          <View style={[styles.radioCircle, selectedBetValue.includes(option) && styles.radioCircleSelected]}>
                              {selectedBetValue.includes(option) && <View style={styles.radioInnerDot} />}
                          </View>
                          <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                  );
              })}

              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={() => setScreen('lineChange')}><Text style={styles.buttonText}>Save Preferences</Text></TouchableOpacity>   
              </View>
            </View>
          ) : screen === 'lineChange' ? (
            <View style={styles.questionsModalContainer}>
              {/* Top row */}
              <View style={styles.topRow}>
                  {/* Back icon */}
                  <TouchableOpacity onPress={() => setScreen('betTypes')}>
                      <Ionicons name="chevron-back" size={24} color="white" style={styles.closeIconQuestionsModal} />
                  </TouchableOpacity>

                  {/* Close icon */}
                  <TouchableOpacity onPress={handleClose}>
                      <Feather name="x" size={24} color="white" style={styles.closeIconQuestionsModal} />
                  </TouchableOpacity>
              </View>

              <Text style={styles.title}>What types of bets do you want to be notified about?</Text>
              <Text style={styles.text}>You can choose more than 1</Text>

              {lineChangesOptions.map((option) => { 
                  const isSelected = selectedBetValue.includes(option);
                  return (
                      <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={[styles.optionButton, selectedBetValue.includes(option) && styles.optionButtonSelected]}>
                          <View style={[styles.radioCircle, selectedBetValue.includes(option) && styles.radioCircleSelected]}>
                              {selectedBetValue.includes(option) && <View style={styles.radioInnerDot} />}
                          </View>
                          <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                  );
              })}
              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={() => setScreen('main')}><Text style={styles.buttonText}>Save Preferences</Text></TouchableOpacity>   
              </View>
            </View>
          ) : null }
      </BlurView>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingsModalContainer: {
    backgroundColor: 'black',
    height: 470,
    width: '100%',
    paddingTop: 25,
    paddingHorizontal: 24,
  },
  questionsModalContainer: {
    backgroundColor: 'black',
    height: 470,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 15,
  },
  closeIconSettingsModal: {
    alignItems: 'flex-end'
    
  },
  closeIconQuestionsModal: {
    color: '#CCD2E3',
  },
  menuOptions: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },
  rowText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'InterSemiBold',
  },
  flagIcon: {
    fontSize: 24,
    width: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 15,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#8001FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
  },
  logoutButtonText: {
    color: 'white',
    fontFamily: 'InterBold',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontFamily: 'InterBold',
    fontSize: 16,
    textAlign: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'RobotoBold',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontFamily: 'SFProDisplayRegular',
    color: 'white',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#8001FF',
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 5,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(128, 1, 255, 0.2)',
    borderColor: '#8001FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#59606D',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    backgroundColor: '#8001FF',
    borderColor: '#8001FF',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
