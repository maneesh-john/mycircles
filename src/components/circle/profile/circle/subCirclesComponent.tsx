import { getProfileCircleSubCircle } from "../../../../redux/actions/profileActions";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PeopleCard from "../../common/peopleCard";
import { DataTable } from "react-native-paper";
import ProviderCard from "../../providers/providerCard";

const PAGE_SIZE: number = 20;
const SubCirclesComponent = (props: any) => {
  const dispatch = useDispatch();

  const { profileCircleSubCircles } = useSelector(
    (state: any) => state.profile
  );
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const [page, setpage] = useState(0);
  const [refresh, setrefresh] = useState(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalItems, setTotalItems] = useState<any>();

  useEffect(() => {
    if (profileCircleSubCircles?.data) {
      const _items = profileCircleSubCircles.data;
      const total_items = profileCircleSubCircles?.paginator?.total_count;
      setTotalItems(total_items ? Number(total_items) : 0);
      setitems(_items);
    } else {
      setTotalItems(0);
      setitems([]);
    }
  }, [profileCircleSubCircles]);

  const getData = async () => {
    setrefresh(true);
    await dispatch(
      getProfileCircleSubCircle(
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
    <View>
      <FlatList
        nestedScrollEnabled={true}
        data={items}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(itemData) => (
          <View style={{ marginTop: 10 }}>
            {itemData.item?.ext_ref_id ? (
              <ProviderCard
                type="physician"
                info={itemData.item}
                color={props.color}
                selectedCircle={props.selectedCircle}
                otherProfile={false}
              />
            ) : (
              <PeopleCard
                userId={props.userId}
                navigator={props.navigator}
                showButtons={itemData.item.id !== props.userData.id}
                item={itemData.item}
                selectedCircle={props.selectedCircle}
                userData={props.userData}
              />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 40 }}>
            <Text style={{ color: "#888", width: "100%", textAlign: "center" }}>
              No sub-circles
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

export default SubCirclesComponent;
