import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
// import Clipboard from "@react-native-clipboard/clipboard";
import Links from "../../components/homeScreen/links";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/circle/meetOthers/header";
import ProvidersFilter from "../../components/circle/meetOthers/providersFilter";
import PeopleFilter from "../../components/circle/meetOthers/peopleFilter";
import {
  getPeopleList,
  getProvidersList,
} from "../../redux/actions/meetOthersAction";
import PeopleCard from "../../components/circle/common/peopleCard";
import ProviderLists from "../../components/circle/providers/providerLists";
import { updateSnackMessage } from "../../redux/actions/homeScreenActions";

const PAGE_ITEM: number = 50;

const MeetOthersScreen = (props: any) => {
  const dispatch = useDispatch();

  const { selectedCircle, userData, myProfileInfo } = useSelector(
    (state: any) => state.app
  );
  const { meetPeopleList, providersData } = useSelector(
    (state: any) => state.profile
  );
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setselectedTab] = useState<number>(0);

  const [peopleFilterData, setPeopleFilterData] = useState<any>({});
  const [location, setLocation] = useState<string>();
  const [peoplePage, setpeoplePage] = useState<number>(PAGE_ITEM);

  const [providersFilterData, setprovidersFilterData] = useState<any>({});
  const [providerPage, setproviderPage] = useState<number>(0);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (userData?.id) {
      setInviteLink(
        `https://mycircles.dovemed.com/share/user/?ref=${userData?.id}`
      );
    }
  }, [userData]);

  useEffect(() => {
    if (selectedCircle?.id) {
      if (selectedTab === 0) {
        dispatch(getPeopleList(1, PAGE_ITEM, selectedCircle.id));
      } else if (selectedTab === 1) {
        dispatch(getProvidersList(0));
      }
    }
  }, [dispatch, selectedTab, selectedCircle]);

  const onRefresh = () => {
    if (selectedTab) {
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
      setproviderPage(0);
    } else {
      dispatch(
        getPeopleList(
          1,
          PAGE_ITEM,
          selectedCircle.id,
          location,
          peopleFilterData?.age,
          peopleFilterData?.gender,
          peopleFilterData?.username
        )
      );
      setpeoplePage(1);
    }
  };

  const searchPeopleFilter = (data: any) => {
    dispatch(
      getPeopleList(
        1,
        PAGE_ITEM,
        selectedCircle.id,
        location,
        data?.age,
        data?.gender,
        data?.username
      )
    );
    setPeopleFilterData(data);
    setpeoplePage(1);
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

  const searchLocation = () => {
    dispatch(
      getPeopleList(
        1,
        PAGE_ITEM,
        selectedCircle.id,
        location,
        peopleFilterData?.age,
        peopleFilterData?.gender,
        peopleFilterData?.username
      )
    );
    setpeoplePage(1);
  };

  const viewMore = () => {
    dispatch(
      getPeopleList(
        1,
        peoplePage + PAGE_ITEM,
        selectedCircle.id,
        location,
        peopleFilterData?.age,
        peopleFilterData?.gender,
        peopleFilterData?.username
      )
    );
    setpeoplePage(peoplePage + PAGE_ITEM);
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
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <HeaderComponent
          selectedTab={selectedTab}
          setselectedTab={setselectedTab}
          color={color}
        />
        <View>
          {selectedTab ? null : (
            <PeopleFilter
              color={color}
              searchPeopleFilter={searchPeopleFilter}
              location={location}
              setLocation={setLocation}
              searchLocation={searchLocation}
            />
          )}
        </View>
        <View>
          {selectedTab ? (
            <View style={styles.inviteLinkContainer}>
              <Text style={styles.inviteLink}>{inviteLink}</Text>
              <Text
                onPress={() => {
                  // if (Clipboard) {
                  //   Clipboard.setString(inviteLink);
                  // }
                  //Alert.alert("Not imple")
                  dispatch(updateSnackMessage("Copied to clipboard"));
                }}
                style={{
                  color: color,
                  fontSize: 12,
                  padding: 8,
                  paddingBottom: 0,
                  alignSelf: "flex-end",
                }}
              >
                Copy Link
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.count}>
                {meetPeopleList?.paginator?.total_count
                  ? meetPeopleList?.paginator?.total_count
                  : 0}{" "}
                Results
              </Text>
              {meetPeopleList?.data ? (
                meetPeopleList.data.map((rs: any, i: number) => (
                  <View key={rs.id}>
                    <PeopleCard
                      type={"otheruser"}
                      userId={props.userId}
                      navigator={props.navigation}
                      showButtons={rs.id !== userData.id}
                      item={rs}
                      selectedCircle={selectedCircle}
                      userData={userData}
                    />
                  </View>
                ))
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
                      fontWeight: "bold",
                      fontSize: 16,
                      textTransform: "uppercase",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    No data found
                  </Text>
                </View>
              )}
              {meetPeopleList?.paginator?.total_count > peoplePage ? (
                <Text onPress={viewMore} style={{ ...styles.loadMore, color }}>
                  Show more
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </View>
      {/* <Links color={color} /> */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    // padding: 15,
  },
  container: {
    padding: 15,
    //backgroundColor: "green",
  },
  count: {
    width: "100%",
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
  },
  viewMore: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: 120,
    alignSelf: "center",
    borderRadius: 15,
    color: colors.secondary,
    overflow: "hidden",
  },
  loadMore: {
    width: "100%",
    textAlign: "right",
    fontFamily: fonts.LATO_BOLD,
    marginVertical: 3,
    textTransform: "lowercase",
  },
  inviteLinkContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 15,
    elevation: 3,
    borderRadius: 10,
  },
  inviteLink: {
    backgroundColor: "#f5f5f5",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    opacity: 0.5,
    borderRadius: 5,
    marginBottom: 5,
  },
});
export default MeetOthersScreen;
