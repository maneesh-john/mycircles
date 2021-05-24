import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { deleteTreatement } from "../../../../redux/actions/homeScreenActions";
import { getAbout } from "../../../../redux/actions/profileActions";
import fonts from "../../../../constants/fonts";

const TreatmentsAndProcedures = (props: any) => {
  const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout?.user_info;

  const { selectedCircle, userData, role } = useSelector(
    (state: any) => state.app
  );

  const [medicationList, setMedicationList] = useState<Array<any>>([]);
  const [activityList, setActivityList] = useState<Array<any>>([]);
  const [procedureList, setProcedureList] = useState<Array<any>>([]);

  const [showMedications, setshowMedications] = useState(false);
  const [showActivities, setshowActivities] = useState(false);
  const [showProcedures, setshowProcedures] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (info && info.treatment) {
      info.treatment.forEach((val: any) => {
        if (val.treatment_type === "Medication") {
          setMedicationList((prev: any) => [...prev, val]);
        } else if (val.treatment_type === "Activity") {
          setActivityList((prev: any) => [...prev, val]);
        } else if (val.treatment_type === "Procedure") {
          setProcedureList((prev: any) => [...prev, val]);
        }
      });
    }
    return () => {
      setMedicationList([]);
      setActivityList([]);
      setProcedureList([]);
    };
  }, [info]);

  const deleteATreatment = async (id: any) => {
    try {
      await deleteTreatement(id);
      dispatch(getAbout(userData.id, selectedCircle.id, role));
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          TYPES OF TREATMENTS AND PROCEDURES ({info?.treatment?.length})
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.sectionHeader}
          onPress={() => setshowMedications((prev) => !prev)}
        >
          <AntDesign
            name={showMedications ? "caretdown" : "caretright"}
            size={18}
          />
          <Text style={styles.sectionHeaderText}>Medication</Text>
        </TouchableOpacity>
        {showMedications ? (
          <View style={styles.contentHolder}>
            {medicationList.length ? (
              medicationList.map((rs: any, index: number) => (
                <View style={styles.content} key={`${rs.id}${index}`}>
                  <Entypo name="dot-single" size={20} color={props.color} />
                  <Text style={styles.value}>
                    {rs.treatment[0].display_name}
                  </Text>
                  {props.isOtherProfile ? null : (
                    <MaterialCommunityIcons
                      onPress={() => deleteATreatment(rs.id)}
                      style={{ marginLeft: 5 }}
                      name="delete-circle"
                      size={30}
                      color={props.color}
                    />
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.value}>No Medication found.</Text>
            )}
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.sectionHeader}
          onPress={() => setshowProcedures((prev) => !prev)}
        >
          <AntDesign
            name={showProcedures ? "caretdown" : "caretright"}
            size={18}
          />
          <Text style={styles.sectionHeaderText}>Procedures</Text>
        </TouchableOpacity>
        {showProcedures ? (
          <View style={styles.contentHolder}>
            {procedureList.length ? (
              procedureList.map((rs: any, index: number) => (
                <View style={styles.content} key={`${rs.id}${index}`}>
                  <Entypo name="dot-single" size={20} color={props.color} />
                  <Text style={styles.value}>
                    {rs.treatment[0].display_name}
                  </Text>
                  {props.isOtherProfile ? null : (
                    <MaterialCommunityIcons
                      onPress={() => deleteATreatment(rs.id)}
                      style={{ marginLeft: 5 }}
                      name="delete-circle"
                      size={30}
                      color={props.color}
                    />
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.value}>No Procedure found.</Text>
            )}
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.sectionHeader}
          onPress={() => setshowActivities((prev) => !prev)}
        >
          <AntDesign
            name={showActivities ? "caretdown" : "caretright"}
            size={18}
          />
          <Text style={styles.sectionHeaderText}>Activities</Text>
        </TouchableOpacity>
        {showActivities ? (
          <View style={styles.contentHolder}>
            {activityList.length ? (
              activityList.map((rs: any, index: number) => (
                <View style={styles.content} key={`${rs.id}${index}`}>
                  <Entypo name="dot-single" size={20} color={props.color} />
                  <Text style={styles.value}>
                    {rs.treatment[0].display_name}
                  </Text>
                  {props.isOtherProfile ? null : (
                    <MaterialCommunityIcons
                      onPress={() => deleteATreatment(rs.id)}
                      style={{ marginLeft: 5 }}
                      name="delete-circle"
                      size={30}
                      color={props.color}
                    />
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.value}>No Activity found.</Text>
            )}
          </View>
        ) : null}
      </View>
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
    width: "100%",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    fontFamily: fonts.LATO_BOLD,
    flex: 1,
    color: "#333",
  },
  contentWrapper: {
    borderRadius: 5,
    overflow: "hidden",
  },
  contentHolder: {
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    padding: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  value: {
    color: "#333",
    textTransform: "capitalize",
    marginHorizontal: 5,
    fontFamily: fonts.LATO_REGULAR,
  },
  sectionHeader: {
    padding: 10,
    width: "100%",
    backgroundColor: "#f6f6f6",
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeaderText: {
    fontSize: 15,
    marginLeft: 10,
    fontFamily: fonts.LATO_BOLD,
    flex: 1,
    color: "#333",
  },
});

export default TreatmentsAndProcedures;
