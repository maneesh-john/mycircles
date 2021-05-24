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
import { getProvidersList } from "../../redux/actions/meetOthersAction";
import Links from "../../components/homeScreen/links";
import AddProvider from "../../components/circle/providers/addProvider";

const ProviderDirectoryScreen = (props: any) => {
  const dispatch = useDispatch();
  const addProvider = props.route.params?.addProvider;
  const [pageKey, setPageKey] = useState(0);
  const { selectedCircle } = useSelector((state: any) => state.app);
  const { providersData } = useSelector((state: any) => state.profile);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const [selectedTab, setselectedTab] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [providerPage, setproviderPage] = useState<number>(0);
  const [providersFilterData, setprovidersFilterData] = useState<any>({});

  useEffect(() => {
    setselectedTab(addProvider ? 1 : 0);
  }, [addProvider]);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (selectedCircle?.id) {
        dispatch(getProvidersList(0));
      }
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (selectedCircle?.id) {
      dispatch(getProvidersList(0));
    }
  }, [dispatch, selectedCircle]);

  const onRefresh = () => {
    // if (selectedTab === 0) {
    //     dispatch(getProvidersList(0, providersFilterData?.first_name, providersFilterData?.last_name, providersFilterData?.city, providersFilterData?.speciality, providersFilterData?.gender, providersFilterData?.state))
    //     setproviderPage(0)
    // }
    if (selectedCircle?.id && selectedTab === 0) {
      dispatch(
        getProvidersList(
          0,
          providersFilterData?.first_name,
          providersFilterData?.last_name,
          providersFilterData?.city,
          providersFilterData?.speciality,
          providersFilterData?.gender,
          providersFilterData?.state
        )
      );
      setProviderPage(0);
      setprovidersFilterData({});
      setPageKey(pageKey + 1);
    }
  };

  const searchProviderFilter = (data: any) => {
    dispatch(
      getProvidersList(
        0,
        data?.first_name,
        data?.last_name,
        data?.city,
        data?.speciality,
        data?.gender,
        data?.state
      )
    );
    setprovidersFilterData(data);
    setproviderPage(0);
  };

  const setProviderPage = (page: number) => {
    dispatch(
      getProvidersList(
        page,
        providersFilterData?.first_name,
        providersFilterData?.last_name,
        providersFilterData?.city,
        providersFilterData?.speciality,
        providersFilterData?.gender,
        providersFilterData?.state
      )
    );
    setproviderPage(page);
  };

  return (
    <ScrollView
      key={pageKey}
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{`PHYSICIAN DIRECTORY`}</Text>
          <Text style={styles.description}>
            You can search from over 1.2 million physicians on DoveMed database
            and add or recommend them to your circles. In case the physician has
            not claimed his/her profile on DoveMed, they shall be notified
            accordingly. Also, if you do not find a physician, please do let us
            know; we can add it for you.
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
              Search Physician
            </Text>
            <Text
              onPress={() => setselectedTab(1)}
              style={{
                ...styles.tab,
                backgroundColor: selectedTab === 1 ? color : colors.secondary,
                color: selectedTab === 1 ? colors.secondary : "#333",
              }}
            >
              Add Physician
            </Text>
          </View>
          {selectedTab === 0 ? (
            <ProvidersFilter
              color={color}
              searchProviderFilter={searchProviderFilter}
              type="provider"
            />
          ) : (
            <AddProvider type="provider" color={color} />
          )}
        </View>
        {selectedTab === 0 && (
          <ProviderLists
            navigation={props.navigation}
            type="physician"
            selectedCircle={selectedCircle}
            color={color}
            providersData={providersData}
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
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
  },
});

export default ProviderDirectoryScreen;
