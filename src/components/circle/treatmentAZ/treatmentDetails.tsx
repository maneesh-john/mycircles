import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";

const TreatmentDetails = (props: any) => {
  const params = props.route.params;
  const navigate = () => {
    props.navigation.navigate("QandAScreen", {
      screen: "QandA",
      params: {
        askQuestion: `${params.display_name}${Math.random()}`,
        prefillData: {
          name: params.display_name,
          type: params?.treatment_type,
          brand: params?.propritary_name,
          manufacturer: params?.labeler_name,
        },
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {params.display_name}
          </Text>
          <Text
            style={{ ...styles.typeContainer, backgroundColor: params.color }}
          >
            {params?.treatment_type}
          </Text>
        </View>
        {params?.treatment_type === "others" && params?.image_url ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: params?.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : null}
        {params?.dosageform && params?.dosageform?.length > 0 ? (
          <View style={styles.field}>
            <Text style={styles.label}>Medication Form </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.dosageform.join(",")}</Text>
          </View>
        ) : null}
        {params?.labeler_name ? (
          <View style={styles.field}>
            <Text style={styles.label}>Manufacturer </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.labeler_name}</Text>
          </View>
        ) : null}
        {params?.propritary_name ? (
          <View style={styles.field}>
            <Text style={styles.label}>Brand Name of Medication </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.propritary_name}</Text>
          </View>
        ) : null}
        {params?.substance_name ? (
          <View style={styles.field}>
            <Text style={styles.label}>Active Ingredient </Text>
            <Text>:</Text>
            <Text style={styles.value}>{`${
              params?.substance_name.length > 0 && params.substance_name[0]
            } ${params["active_numerator_strength"]} ${
              params["active_ingred_unit"]
            }`}</Text>
          </View>
        ) : null}
        {params?.route_name ? (
          <View style={styles.field}>
            <Text style={styles.label}>Route of Administration </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.route_name}</Text>
          </View>
        ) : null}
        {params?.pharm_classes ? (
          <View style={styles.field}>
            <Text style={styles.label}>Pharmaceutical Class </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.pharm_classes}</Text>
          </View>
        ) : null}
        {params?.code ? (
          <View style={styles.field}>
            <Text style={styles.label}> NDC Link </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params?.code}</Text>
          </View>
        ) : null}
        {/* {params?.display_name ? (
          <View style={styles.field}>
            <Text style={styles.label}>Treatment </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params.display_name}</Text>
          </View>
        ) : null}
        {params?.treatment_type ? (
          <View style={styles.field}>
            <Text style={styles.label}>Treatment Type </Text>
            <Text>:</Text>
            <Text style={styles.value}>{params.treatment_type}</Text>
          </View>
        ) : null}
        {params?.type || params?.category ? (
          <View style={styles.field}>
            <Text style={styles.label}>Treatment Category </Text>
            <Text>:</Text>
            <Text style={styles.value}>
              {params?.type ? params.type : params?.category}
            </Text>
          </View>
        ) : null}
        {params?.treatment_type === "others" ? (
          <View>
            {params?.value ? (
              <View style={styles.field}>
                <Text style={styles.label}>Treatment Value</Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.value}</Text>
              </View>
            ) : null}
            {params?.dosageform?.length ? (
              <View style={styles.field}>
                <Text style={styles.label}>Treatment Dosage Form </Text>
                <Text>:</Text>
                <Text style={styles.value}>
                  {params?.dosageform?.toString()}
                </Text>
              </View>
            ) : null}
            {params?.labeler_name ? (
              <View style={styles.field}>
                <Text style={styles.label}>Labeler Name </Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.labeler_name}</Text>
              </View>
            ) : null}
            {params?.propritary_name ? (
              <View style={styles.field}>
                <Text style={styles.label}>Propritary Name</Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.propritary_name}</Text>
              </View>
            ) : null}
            {params?.substance_name?.length ? (
              <View style={styles.field}>
                <Text style={styles.label}>Substance Name </Text>
                <Text>:</Text>
                <Text style={styles.value}>
                  {params?.substance_name?.toString()}
                </Text>
              </View>
            ) : null}
            {params?.route_name ? (
              <View style={styles.field}>
                <Text style={styles.label}>Route Name </Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.route_name}</Text>
              </View>
            ) : null}
            {params?.description ? (
              <View style={styles.field}>
                <Text style={styles.label}>Description </Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.description}</Text>
              </View>
            ) : null}
            {params?.synonym?.length ? (
              <View style={styles.field}>
                <Text style={styles.label}>Synonym </Text>
                <Text>:</Text>
                <Text style={styles.value}>{params?.synonym?.toString()}</Text>
              </View>
            ) : null}
          </View>
        ) : null} */}
        <View style={styles.askView}>
          <Text style={styles.askType}>
            Ask A Question About{" "}
            <Text style={styles.type}>{params?.display_name}</Text>
          </Text>
          <Text
            onPress={navigate}
            style={{ ...styles.askBtn, backgroundColor: params.color }}
          >
            Ask a question
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {},
  container: {
    margin: 15,
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  field: {
    flexDirection: "row",
    marginVertical: 3,
    alignItems: "flex-start",
  },
  label: {
    marginRight: 2,
    fontFamily: fonts.LATO_BOLD,
    color: "#333",
    width: "40%",
  },
  value: {
    fontFamily: fonts.LATO_REGULAR,
    marginLeft: 5,
    marginTop: 3,
    color: "#333",
    width: "60%",
  },
  askView: {
    backgroundColor: "#f6f6f6",
    marginVertical: 20,
    paddingVertical: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  askType: {
    width: "100%",
    fontFamily: fonts.LATO_REGULAR,
    color: "#333",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  type: {
    fontFamily: fonts.LATO_BOLD,
    color: "#333",
  },
  askBtn: {
    fontFamily: fonts.LATO_BOLD,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    color: colors.secondary,
    overflow: "hidden",
  },
  imageContainer: {
    height: 180,
    backgroundColor: "#f8f8f8",
    marginBottom: 15,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  typeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    display: "flex",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    borderRadius: 10,
    marginTop: 10,
    color: "#fff",
    marginBottom: 10,
  },
});

export default TreatmentDetails;
