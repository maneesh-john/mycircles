import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../../../../constants/colors";
import { updateOrganizationContactInfo } from "../../../../redux/actions/profileActions";

const EditOrgContactInfo = (props: any) => {
  const dispatch = useDispatch();

  const { selectedCircle, userData, role } = useSelector(
    (state: any) => state.app
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (props.info["organization_location"]) {
      if (props.info?.organization_location.length > 0) {
        setStreet(props.info?.organization_location[0]?.address_line1);
        setCity(props.info?.organization_location[0]?.city);
        setState(props.info?.organization_location[0]?.state);
        setZipcode(props.info?.organization_location[0]?.zip_code);
      }
    }
    setPhone(props.info?.organization_contact);
    setEmail(props.info?.organization_email);
  }, [props.info]);

  const closeModal = () => {
    props.setmodalVisible(false);
  };

  const onsave = async () => {
    setIsLoading(true);
    try {
      const body: any = {
        address_line1: street,
        address_line2: null,
        city: city,
        state: state,
        zip_code: zipcode,
      };
      if (role === "advocate") {
        body["advocate"] = {
          organization_contact: phone,
          organization_email: email,
        };
      } else if (role === "hcp") {
        body["advocate"] = {
          organization_contact: phone,
          organization_email: email,
        };
      }
      await dispatch(
        updateOrganizationContactInfo(
          userData.id,
          selectedCircle.id,
          body,
          props.info?.organization_location[0]?.id,
          role
        )
      );
      setIsLoading(false);
      closeModal();
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Oops", error.message);
    }
  };

  return (
    <Modal
      transparent={true}
      onRequestClose={() => closeModal()}
      animationType="slide"
      visible={props.modalVisible}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.activityIndication}>
            <ActivityIndicator size={40} color={props.color} />
          </View>
        ) : null}
        <View style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.modalHeaderText}>Contact Details</Text>
              <MaterialIcons name="close" onPress={closeModal} size={26} />
            </View>
            <ScrollView>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>Number, Street</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="1400, West Park Street"
                  keyboardType="default"
                  maxLength={50}
                  value={street}
                  onChangeText={(value: any) => setStreet(value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Urbana"
                  keyboardType="default"
                  maxLength={50}
                  value={city}
                  onChangeText={(value: any) => setCity(value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Illinois"
                  keyboardType="default"
                  maxLength={50}
                  value={state}
                  onChangeText={(value: any) => setState(value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>Zipcode</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="61801"
                  keyboardType="default"
                  maxLength={50}
                  value={zipcode}
                  onChangeText={(value: any) => setZipcode(value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="(217) 337-2000"
                  keyboardType="phone-pad"
                  maxLength={50}
                  value={phone}
                  onChangeText={(value: any) => setPhone(value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputHolder}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="abc@example.com"
                  keyboardType="email-address"
                  maxLength={50}
                  value={email}
                  onChangeText={(value: any) => setEmail(value)}
                  returnKeyType="done"
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ ...styles.btn, borderColor: props.color }}
                onPress={closeModal}
              >
                <Text style={{ ...styles.btnText, color: props.color }}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onsave}
                style={{
                  ...styles.btn,
                  borderColor: props.color,
                  backgroundColor: props.color,
                }}
              >
                <Text style={{ ...styles.btnText }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.8)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    backgroundColor: colors.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f6f6f6",
  },
  inputHolder: {
    paddingHorizontal: 15,
    paddingTop: 3,
  },
  modalHeaderText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#333",
    flex: 1,
    textTransform: "uppercase",
  },
  modalFooter: {
    borderTopColor: "#ccc",
    borderTopWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  inputField: {
    backgroundColor: colors.secondary,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    width: "100%",
    marginBottom: 5,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  error: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "red",
  },
  btn: {
    minWidth: 120,
    paddingVertical: 8,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    textTransform: "uppercase",
    color: colors.secondary,
  },
  activityIndication: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.8)",
  },
});
export default EditOrgContactInfo;
