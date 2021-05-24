import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import ProviderCard from "./providerCard";
import fonts from "../../../constants/fonts";

const ProviderLists = (props: any) => {
  const {
    providersData,
    color,
    page,
    setpage,
    selectedCircle,
    meetOthers,
    navigation,
    type,
  } = props;

  const navigate = () => {
    if (meetOthers) {
      navigation.navigate("Home", {
        screen: "ProviderDirectoryScreen",
        initial: false,
        params: {
          screen: "ProviderDirectory",
          params: { addProvider: true },
        },
      });
    }
  };

  let count = 0;
  if (providersData?.total_hits) {
    count = providersData.total_hits;
  }
  if (providersData?.count) {
    count = providersData.count;
  }
  return (
    <View>
      <Text style={styles.count}>{count} Results</Text>
      {providersData?.results?.length ? (
        providersData?.results?.map((res: any) => (
          <ProviderCard
            navigation={navigation}
            type={type}
            key={res.id}
            info={res}
            color={color}
            selectedCircle={selectedCircle}
            otherProfile={true}
          />
        ))
      ) : meetOthers ? (
        <View>
          <Text style={styles.info}>
            It seems your physician profile is not in our database.
          </Text>
          <Text style={styles.info}>
            Please create your profile to get reviews and respond to your
            patients.
          </Text>
          <Text
            onPress={navigate}
            style={{ ...styles.btn, backgroundColor: color }}
          >
            create profile
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 40,
          }}
        >
          <Text
            style={{
              color: "#888",
              fontFamily: fonts.LATO_BOLD,
              fontSize: 16,
              textTransform: "uppercase",
              width: "100%",
              textAlign: "center",
            }}
          >
            No data
          </Text>
        </View>
      )}
      {(type == "other" || type == "nfp") && providersData?.count && (
        <DataTable.Pagination
          accessibilityStates
          page={page}
          numberOfPages={providersData?.count}
          onPageChange={(_page) => setpage(_page)}
          label={`${12 * page + 1} - ${
            (providersData?.count < 12 ? providersData?.count : 12) * (page + 1)
          } of ${providersData?.count}`}
        />
      )}
      {providersData?.total_hits ? (
        <DataTable.Pagination
          accessibilityStates
          page={page}
          numberOfPages={providersData?.total_pages}
          onPageChange={(_page) => setpage(_page)}
          label={`${12 * page + 1} - ${
            (providersData?.total_hits < 12 ? providersData?.total_hits : 12) *
            (page + 1)
          } of ${providersData?.total_hits}`}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  count: {
    width: "100%",
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
  },
  info: {
    fontFamily: fonts.LATO_REGULAR,
    width: "100%",
    marginBottom: 2,
  },
  btn: {
    alignSelf: "center",
    width: 150,
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 15,
    paddingHorizontal: 2,
    fontFamily: fonts.LATO_REGULAR,
    textTransform: "uppercase",
    marginVertical: 5,
    color: "#fff",
    overflow: "hidden",
  },
});

export default ProviderLists;
