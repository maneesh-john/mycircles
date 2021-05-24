import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import { useSelector, useDispatch } from "react-redux";
import ProvidersFilter from "../../components/circle/meetOthers/providersFilter";
import ProviderLists from "../../components/circle/providers/providerLists";
// import { getProvidersList } from '../../redux/actions/meetOthersAction'
import Links from "../../components/homeScreen/links";
import AddProvider from "../../components/circle/providers/addProvider";
import { getDirectoryData } from "../../redux/actions/meetOthersAction";

const NFPDirectoryScreen = (props: any) => {
  const dispatch = useDispatch();

  const { selectedCircle } = useSelector((state: any) => state.app);
  const { nfpData } = useSelector((state: any) => state.profile);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const [selectedTab, setselectedTab] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [providerPage, setproviderPage] = useState<number>(0);
  const [providersFilterData, setprovidersFilterData] = useState<any>({});

  useEffect(() => {
    if (selectedCircle?.id) {
      dispatch(getDirectoryData("nfp", { page: 0 }));
    }
  }, [dispatch, selectedCircle]);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      if (selectedCircle?.id) {
        dispatch(getDirectoryData("nfp", { page: 0 }));
      }
    });
    return unsubscribe;
  }, [props.navigation]);

  const onRefresh = () => {
    if (selectedTab === 0) {
      const filter: any = { ...providersFilterData, page: 0 };
      dispatch(getDirectoryData("nfp", { page: 0 }));
      setproviderPage(0);
    }
  };

  const searchProviderFilter = (data: any) => {
    const filter: any = { ...data, page: 0 };
    dispatch(getDirectoryData("nfp", filter));
    setprovidersFilterData(data);
    setproviderPage(0);
  };

  const setProviderPage = (page: number) => {
    const filter: any = { ...providersFilterData, page };
    dispatch(getDirectoryData("nfp", filter));
    setproviderPage(page);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{`Non For Profit Directory`}</Text>
          <Text style={styles.description}>
            You can search from over hundred thousand Non For Profit
            organizations on DoveMed database and add or recommend them to your
            circles, based on your location. If you are unable to find a
            particular organization, please do let us know and we will add it
            for you after a simple verification process.
          </Text>
          <View style={{ ...styles.tabs, borderColor: color }}>
            <Text
              onPress={() => setselectedTab(0)}
              style={{
                ...styles.tab,
                backgroundColor: selectedTab === 0 ? color : colors.secondary,
                color: selectedTab === 0 ? colors.secondary : "#333",
              }}
            >
              Search Non For Profit
            </Text>
            <Text
              onPress={() => setselectedTab(1)}
              style={{
                ...styles.tab,
                backgroundColor: selectedTab === 1 ? color : colors.secondary,
                color: selectedTab === 1 ? colors.secondary : "#333",
              }}
            >
              Add Non For Profit
            </Text>
          </View>
          {selectedTab === 0 ? (
            <ProvidersFilter
              color={color}
              searchProviderFilter={searchProviderFilter}
              type="nfp"
            />
          ) : (
            <AddProvider type="nfp" color={color} />
          )}
        </View>
        {selectedTab === 0 && (
          <ProviderLists
            navigation={props.navigation}
            type="nfp"
            selectedCircle={selectedCircle}
            color={color}
            providersData={nfpData}
            page={providerPage}
            setpage={setProviderPage}
          />
        )}
      </View>
      <Links color={color} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    // padding: 15,
  },
  container: {
    padding: 15,
    backgroundColor: "#f6f6f6",
  },
  count: {
    width: "100%",
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
  },
  headerContainer: {
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
  title: {
    fontSize: 18,
    paddingBottom: 8,
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
    textAlign: "center",
  },
  description: {
    paddingBottom: 15,
    fontFamily: fonts.LATO_REGULAR,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: fonts.LATO_BOLD,
  },
});

export default NFPDirectoryScreen;
