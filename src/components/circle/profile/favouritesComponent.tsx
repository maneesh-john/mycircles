import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getFavoritesList } from "../../../redux/actions/profileActions";
import { DataTable } from "react-native-paper";
import QuestionCard from "../common/questionCard";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";

const PAGE_SIZE: number = 20;

const FavouritesComponent = (props: any) => {
  const dispatch = useDispatch();

  const {
    selectedCircle,
    userData,
    userProfileInfo,
    isOtherProfile,
    myProfileInfo,
  } = props;
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const { favoritesList } = useSelector((state: any) => state.profile);
  const { userSelectedRole } = useSelector((state: any) => state.app);

  const [page, setpage] = useState(0);
  const [refresh, setrefresh] = useState(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalItems, setTotalItems] = useState<any>();

  useEffect(() => {
    if (favoritesList?.data) {
      const _items = favoritesList.data;
      const total_items = favoritesList?.paginator?.total_count;
      setTotalItems(total_items ? Number(total_items) : 0);
      setitems(_items);
    } else {
      setTotalItems(0);
      setitems([]);
    }
  }, [favoritesList]);

  React.useEffect(() => {
    const unsubscribe = props.navigator.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [props.navigator]);

  const getData = async () => {
    setrefresh(true);
    let apiRole = userSelectedRole.role;
    if (isOtherProfile) {
      if (userProfileInfo?.user_info?.id) {
        apiRole = userProfileInfo?.user_info?.role;
      } else if (userProfileInfo?.user_info?.user_info?.id) {
        apiRole = userProfileInfo?.user_info?.user_info?.role;
      }
    }
    let userId = userProfileInfo?.user_info?.id
      ? userProfileInfo?.user_info?.id
      : userProfileInfo?.user_info?.user_info?.id;
    await dispatch(
      getFavoritesList(apiRole, page + 1, PAGE_SIZE, userId, selectedCircle.id)
    );
    setrefresh(false);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled={true}
        data={items}
        keyExtractor={(item) => `${item.favorite[0].id}`}
        renderItem={(itemData) => (
          <View style={{ marginTop: 10 }}>
            <QuestionCard
              navigator={props.navigator}
              isOtherProfile={isOtherProfile}
              item={itemData.item.favorite[0]}
              selectedCircle={selectedCircle}
              userProfileInfo={myProfileInfo}
              userData={userData}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 40 }}>
            <Text
              style={{
                color: "#888",
                width: "100%",
                textAlign: "center",
                fontFamily: fonts.LATO_REGULAR,
              }}
            >
              No favorites found
            </Text>
          </View>
        )}
        onRefresh={getData}
        refreshing={refresh}
      />
      {totalItems ? (
        <DataTable.Pagination
          accessibilityStates
          page={page}
          numberOfPages={Math.ceil(totalItems / PAGE_SIZE)}
          onPageChange={(_page) => setpage(_page)}
          label={`${PAGE_SIZE * page + 1} - ${
            (totalItems < PAGE_SIZE ? totalItems : PAGE_SIZE) * (page + 1)
          } of ${totalItems}`}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  count: {
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default FavouritesComponent;
