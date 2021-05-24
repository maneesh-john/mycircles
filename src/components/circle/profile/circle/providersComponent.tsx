import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getProfileCircleDoctors } from "../../../../redux/actions/profileActions";
import PeopleCard from "../../common/peopleCard";
import { DataTable } from "react-native-paper";
import ProviderCard from "../../providers/providerCard";

const PAGE_SIZE: number = 20;

const ProvidersComponent = (props: any) => {
  const dispatch = useDispatch();

  const { profileCircleDoctors } = useSelector((state: any) => state.profile);
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const [page, setpage] = useState(0);
  const [refresh, setrefresh] = useState(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalItems, setTotalItems] = useState<any>();

  useEffect(() => {
    if (profileCircleDoctors) {
      const { _items, total_items } = getItems(
        props.type,
        profileCircleDoctors
      );
      setTotalItems(total_items ? Number(total_items) : 0);
      setitems(_items);
    } else {
      setTotalItems(0);
      setitems([]);
    }
  }, [profileCircleDoctors]);
  const getItems = (type: number, _items: any) => {
    switch (type) {
      case 2:
        return {
          _items: _items?.hospitals?.virtual_hospitals,
          total_items: _items?.hospitals?.hospitals_paginator?.total_count,
        };
      case 3:
        return {
          _items: _items?.clinics?.virtual_clinics,
          total_items: _items?.clinics?.clinics_paginator?.total_count,
        };
      case 4:
        return {
          _items: _items?.nfps?.virtual_nfps,
          total_items: _items?.nfps?.nfps_paginator?.total_count,
        };
      case 5:
        return {
          _items: _items?.hcps?.virtual_hcps,
          total_items: _items?.hcps?.hcps_paginator?.total_count,
        };
      case 6:
        return {
          _items: _items?.doctors?.virtual_doctors,
          total_items: _items?.doctors?.doctors_paginator?.total_count,
        };
      default:
        return {
          _items: _items?.doctors?.virtual_doctors,
          total_items: _items?.doctors?.doctors_paginator?.total_count,
        };
    }
  };
  const getData = async () => {
    setrefresh(true);
    await dispatch(
      getProfileCircleDoctors(
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

  const getType = (type: any) => {
    switch (type) {
      case 2:
        return "hospital";
      case 3:
        return "clinic";
      case 4:
        return "nfp"; //"non for profit";
      case 5:
        return "other"; //"health care professional";
      case 6:
        return "physician";
      default:
        return "physician";
    }
  };

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
                navigation={props.navigator}
                type={getType(props.type)}
                info={itemData.item}
                color={props.color}
                selectedCircle={props.selectedCircle}
                onCircle={props.isOtherProfile ? false : true}
                otherProfile={props.isOtherProfile}
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
              No {getType(props.type)} in the circle
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

export default ProvidersComponent;
