import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAskedQuestions } from "../../../../redux/actions/profileActions";
import { DataTable } from "react-native-paper";
import QuestionCard from "../../common/questionCard";

const PAGE_SIZE: number = 20;

const AskedComponent = (props: any) => {
  const dispatch = useDispatch();

  const { askedQuestions } = useSelector((state: any) => state.profile);
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const [page, setpage] = useState(0);
  const [refresh, setrefresh] = useState(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalItems, setTotalItems] = useState<any>();

  useEffect(() => {
    if (askedQuestions?.data) {
      const _items = askedQuestions.data;
      const total_items = askedQuestions?.paginator?.total_count;
      setTotalItems(total_items ? Number(total_items) : 0);
      setitems(_items);
    } else {
      setTotalItems(0);
      setitems([]);
    }
  }, [askedQuestions]);

  const getData = async () => {
    setrefresh(true);
    await dispatch(
      getAskedQuestions(
        props.isOtherProfile ? props.otherProfileRole : userSelectedRole.role,
        page + 1,
        PAGE_SIZE,
        props.userId,
        props.selectedCircle.id
      )
    );
    setrefresh(false);
  };

  React.useEffect(() => {
    const unsubscribe = props.navigator.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [props.navigator]);

  useEffect(() => {
    getData();
  }, [props.userId, props.selectedCircle, page]);

  return (
    <View style={styles.container}>
      {totalItems ? (
        <Text style={styles.count}>{totalItems} Questions asked</Text>
      ) : null}
      <FlatList
        nestedScrollEnabled={true}
        data={items}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(itemData) => (
          <View style={{ marginTop: 10 }}>
            <QuestionCard
              navigator={props.navigator}
              isOtherProfile={props.isOtherProfile}
              item={itemData.item}
              selectedCircle={props.selectedCircle}
              userProfileInfo={props.userProfileInfo}
              userData={props.userData}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 40 }}>
            <Text style={{ color: "#888", width: "100%", textAlign: "center" }}>
              No asked questions
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

export default AskedComponent;
