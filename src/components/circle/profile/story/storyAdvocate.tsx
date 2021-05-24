import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../../constants/colors";
import EditOtherInfoModal from "./editOtherInfoModal";
import EditOrgContactInfo from "./editOrgContactInfo";
import fonts from "../../../../constants/fonts";

const StoryAdvocate = (props: any) => {
  const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout;
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible1, setmodalVisible1] = useState(false);

  const editItem = () => {
    setmodalVisible(true);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            About {info?.represent_organization}
          </Text>
          {!props.isOtherProfile && (
            <AntDesign
              name="edit"
              onPress={() => {
                editItem();
              }}
              size={18}
              color={colors.secondary}
              style={{ ...styles.edit, backgroundColor: props.color }}
            />
          )}
        </View>
        <Text style={styles.value}>{info?.about}</Text>
      </View>
      {(info?.organization_location ||
        info?.organization_contact ||
        info?.organization_email) && (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Contact Details</Text>
            {!props.isOtherProfile && (
              <AntDesign
                name="edit"
                onPress={() => {
                  setmodalVisible1(true);
                }}
                size={18}
                color={colors.secondary}
                style={{ ...styles.edit, backgroundColor: props.color }}
              />
            )}
          </View>
          {info?.organization_location &&
          info?.organization_location[0]?.address_line1 ? (
            <Text style={styles.value}>
              {info?.organization_location[0]?.address_line1}
            </Text>
          ) : null}
          {info?.organization_location &&
          info?.organization_location[0]?.city ? (
            <Text style={styles.value}>
              {info?.organization_location[0]?.city}
            </Text>
          ) : null}
          {info?.organization_location &&
          info?.organization_location[0]?.state ? (
            <Text style={styles.value}>
              {info?.organization_location[0]?.state}
            </Text>
          ) : null}
          {info?.organization_location &&
          info?.organization_location[0]?.country ? (
            <Text style={styles.value}>
              {info?.organization_location[0]?.country}
            </Text>
          ) : null}
          {info?.organization_location &&
          info?.organization_location[0]?.zip_code ? (
            <Text style={styles.value}>
              {info?.organization_location[0]?.zip_code}
            </Text>
          ) : null}
          {info?.organization_contact ? (
            <Text style={styles.value}>{info?.organization_contact}</Text>
          ) : null}
          {info?.organization_email ? (
            <Text style={styles.value}>{info?.organization_email}</Text>
          ) : null}
        </View>
      )}
      <EditOtherInfoModal
        info={info}
        setmodalVisible={setmodalVisible}
        selectedItem="about"
        modalVisible={modalVisible}
        color={props.color}
      />
      <EditOrgContactInfo
        info={info}
        setmodalVisible={setmodalVisible1}
        modalVisible={modalVisible1}
        color={props.color}
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
    padding: 5,
    overflow: "hidden",
    textAlign: "center",
    borderRadius: 15,
  },
  contentHolder: {},
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  value: {
    color: "#333",
    textTransform: "capitalize",
    marginBottom: 3,
    fontFamily: fonts.LATO_REGULAR,
  },
});

export default StoryAdvocate;
