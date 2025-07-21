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

type QuestionsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const QuestionsModal: React.FC<QuestionsModalProps> = ({ visible, onClose }) => {
    const [screen, setScreen] = useState<'main' | 'line-change'>('main');
    const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

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
    });

    if (!fontsLoaded) return null;
  
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <BlurView intensity={12} tint="dark" style={styles.backdrop}>
                <View style={styles.modalContainer}>
                    

                </View>
            </BlurView>
        </Modal>
    );
};

export default QuestionsModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'black',
        height: 470,
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 24,
    },
    closeIcon: {
        position: 'absolute',
        right: 20,
        top: 16,
    },
    topRow: {
        flexDirection: 'row',
    },
    buttonsContainer: {
        flexDirection: 'column',
        gap: 15,
        marginTop: 20,
    },
});
