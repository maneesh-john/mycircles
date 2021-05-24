import React, { useEffect, useState } from 'react'
import { Modal, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import MySymptoms from '../../../../components/homeScreen/signUpForms/mySymptoms'
import colors from '../../../../constants/colors';
import { useSelector } from 'react-redux';

const EditSymptomsModal = (props: any) => {
    const closeModal = () => {
        props.setmodalVisible(false)
    }
    const { role } = useSelector((state: any) => state.app)

    const [_role, set_role] = useState(1)

    useEffect(() => {
        switch (role) {
            case 'patient':
                set_role(1)
                break;
            case 'caregiver':
                set_role(2)
                break;
            default:
                break;
        }
    }, [role])
    return (
        <Modal transparent={true} onRequestClose={() => closeModal()} animationType="slide" visible={props.modalVisible}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.modal}>
                    <ScrollView style={styles.container}>
                        <MySymptoms handleNext={closeModal} edit={true} role={role} selectedRole={_role} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.8)',
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        minWidth: '100%',
        backgroundColor: colors.secondary
    },
})
export default EditSymptomsModal
