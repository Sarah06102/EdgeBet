import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur';
import Feather from '@expo/vector-icons/Feather';
import { useFonts } from 'expo-font';

type Props = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const LogoutConfirmModal: React.FC<Props> = ({ visible, onConfirm, onCancel }) => {
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
        <Modal transparent visible={visible} animationType="fade">
            <BlurView intensity={15} tint="dark" style={styles.container}>
                <View style={styles.modalBox}>
                    
                    <View style={styles.topRow}>
                        <Text style={styles.title}>Are you sure you want to leave?</Text>
                        <TouchableOpacity onPress={onCancel}>
                            <Feather name="x" size={24} color="white" style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.text}>Are you sure you want to log out of your account?</Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={onConfirm}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.cancelText}>Close</Text>
                    </TouchableOpacity>

                </View>
            </BlurView>
        </Modal>
    );
};

export default LogoutConfirmModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: 'black',
        padding: 24,
        borderRadius: 12,
        width: '85%',
        borderColor: 'white',
        borderWidth: 1,
    },
    closeIcon: {
        color: '#CCD2E3',
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 8,
        fontFamily: 'InterBold',
        lineHeight: 24,
    },
    text: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 24,
        marginTop: 10,
        fontFamily: 'RobotoLight',
        lineHeight: 24,
    },
    logoutButton: {
        backgroundColor: '#8001FF',
        padding: 14,
        borderRadius: 6,
        marginBottom: 12,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff7ee',
        padding: 14,
        borderRadius: 6,
    },
    cancelText: {
        color: '#8001FF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});