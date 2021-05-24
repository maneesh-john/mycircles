import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../../constants/colors";
import EditPatientAbout from "./editPatientAbout";
import fonts from "../../../../constants/fonts";

const AboutPatient = (props: any) => {
  const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout?.user_info;
  const [modalVisible, setmodalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ABOUT PATIENT</Text>
        {props.isOtherProfile ? null : (
          <AntDesign
            onPress={() => {
              setmodalVisible(true);
            }}
            name="edit"
            size={18}
            color={colors.secondary}
            style={{ ...styles.edit, backgroundColor: props.color }}
          />
        )}
      </View>
      <View style={styles.contentHolder}>
        <View style={styles.content}>
          <Text style={styles.key}>Date of Birth</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.dob}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.key}>Diagnosis Date</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.diagnosis_date}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.key}>Gender</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.gender}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.key}>Current Situation</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.current_situation}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.key}>Relationship Status</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.relationship_status}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.key}>Mini Bio</Text>
          <Text> : </Text>
          <Text style={styles.value}>{info?.mini_bio}</Text>
        </View>
      </View>
      <EditPatientAbout
        color={props.color}
        info={info}
        setmodalVisible={setmodalVisible}
        modalVisible={modalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.secondary,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    fontFamily: fonts.LATO_BOLD,
    flex: 1,
    color: "#333",
  },
  edit: {
    height: 30,
    width: 30,
    backgroundColor: "pink",
    padding: 5,
    overflow: "hidden",
    textAlign: "center",
    borderRadius: 15,
  },
  contentHolder: {},
  content: {
    flexDirection: "row",
    // alignItems: 'center',
    marginBottom: 5,
  },
  key: {
    fontSize: 15,
    fontFamily: fonts.LATO_BOLD,
    marginRight: 5,
    flex: 1,
    color: "#333",
  },
  value: {
    flex: 1,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
    textTransform: "capitalize",
  },
});

export default AboutPatient;
