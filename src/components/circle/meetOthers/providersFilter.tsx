import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import SelectCategory from "../Q&A/selectCategory";
import { useSelector } from "react-redux";

const ProvidersFilter = (props: any) => {
  const { stateList } = useSelector((state: any) => state.profile);
  const { color, searchProviderFilter } = props;
  const [state, setState] = useState<any>();
  const [gender, setGender] = useState<string>();
  const [name, setName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [city, setCity] = useState<string>();
  const [speciality, setSpeciality] = useState<string>();

  const [showFilters, setshowFilters] = useState<boolean>(false);
  const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);

  const toggleFiltersVisibility = () => setshowFilters(!showFilters);

  useEffect(() => {
    setopenCategoryModal(false);
  }, []);

  const clearAll = () => {
    setGender(undefined);
    setUsername(undefined);
    setCity(undefined);
    setSpeciality(undefined);
    searchProviderFilter();
  };

  const selectState = (state: any) => {
    setState(state);
    setopenCategoryModal(false);
  };

  const searchForData = () => {
    let filters: any = {};
    if (props.type === "provider") {
      filters = {
        first_name: username,
        last_name: name,
        city: city,
        speciality: speciality,
        gender: gender,
        state: state?.display_name ? state.display_name : undefined,
      };
    } else if (props.type === "hospital") {
      if (name) {
        filters["hospital_name"] = name;
      }
      if (state?.display_name) {
        filters["state"] = state?.display_name;
      }
    } else if (props.type === "clinic") {
      if (name) {
        filters["clinic_name"] = name;
      }
      if (state?.display_name) {
        filters["state"] = state?.display_name;
      }
    } else if (props.type === "other") {
      if (speciality) {
        filters["speciality"] = speciality;
      }
      if (name) {
        filters["full_name"] = name;
      }
      if (state?.display_name) {
        filters["state"] = state?.display_name;
      }
    }
    searchProviderFilter(filters);
  };

  const submitFilter = () => {
    let filters: any = {};
    if (props.type === "provider") {
      filters = {
        first_name: username,
        last_name: name,
        city: city,
        speciality: speciality,
        gender: gender,
        state: state?.display_name ? state.display_name : undefined,
      };
    }
    searchProviderFilter(filters);
  };

  return (
    <View style={styles.container}>
      <View style={{ ...styles.section, borderColor: color }}>
        <TextInput
          style={styles.location}
          placeholder={"Name"}
          placeholderTextColor="#888"
          value={name}
          onChangeText={(value: any) => setName(value)}
        />
        <View style={{ width: 1.2, height: 50, backgroundColor: color }}></View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setopenCategoryModal(true);
          }}
          style={{ ...styles.category, borderColor: color }}
        >
          <Text style={styles.categoryText}>
            {state?.display_name ? state.display_name : `Select State`}
          </Text>
          <AntDesign
            name="down"
            size={18}
            color={"#333"}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={searchForData}
          style={{ ...styles.btn, backgroundColor: color }}
        >
          <AntDesign name="search1" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
      {openCategoryModal ? (
        <SelectCategory
          color={color}
          selectedCategory={state}
          onSelect={selectState}
          openCategoryModal={openCategoryModal}
          setopenCategoryModal={setopenCategoryModal}
          questionCategories={stateList}
        />
      ) : null}
      {props.type === "provider" && (
        <>
          <View style={styles.row}>
            <Text style={styles.filterToggle} onPress={toggleFiltersVisibility}>
              {showFilters ? "Hide" : "Show"} Filters
            </Text>
            {showFilters ? (
              <Text style={{ ...styles.clearFilter, color }} onPress={clearAll}>
                Clear Filters
              </Text>
            ) : null}
          </View>
          {showFilters && (
            <View>
              <View>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={{ ...styles.username, borderColor: color }}
                  placeholder={"Username"}
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={(value: any) => setUsername(value)}
                />
              </View>
              <View>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={{ ...styles.username, borderColor: color }}
                  placeholder={"City"}
                  placeholderTextColor="#888"
                  value={city}
                  onChangeText={(value: any) => setCity(value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Speciality</Text>
                <TextInput
                  style={{ ...styles.username, borderColor: color }}
                  placeholder={"Speciality"}
                  placeholderTextColor="#888"
                  value={speciality}
                  onChangeText={(value: any) => setSpeciality(value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Gender</Text>
                <View style={{ ...styles.tabs, borderColor: color }}>
                  <Text
                    onPress={() => setGender("m")}
                    style={{
                      ...styles.tab,
                      backgroundColor:
                        gender === "m" ? color : colors.secondary,
                      color: gender === "m" ? colors.secondary : "#333",
                    }}
                  >
                    Male
                  </Text>
                  <View
                    style={{ width: 1.2, height: 40, backgroundColor: color }}
                  ></View>
                  <Text
                    onPress={() => setGender("f")}
                    style={{
                      ...styles.tab,
                      backgroundColor:
                        gender === "f" ? color : colors.secondary,
                      color: gender === "f" ? colors.secondary : "#333",
                    }}
                  >
                    Female
                  </Text>
                </View>
              </View>
              <Text
                onPress={submitFilter}
                style={{ ...styles.submit, backgroundColor: color }}
              >
                Apply
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 15,
    height: 50,
    overflow: "hidden",
  },
  location: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
    backgroundColor: colors.secondary,
  },
  btn: {
    height: 50,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterToggle: {
    textDecorationLine: "underline",
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
  clearFilter: {
    fontFamily: fonts.LATO_REGULAR,
    marginLeft: 15,
    fontSize: 15,
    color: "#444",
  },
  label: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
    marginVertical: 5,
    width: "100%",
    textAlign: "center",
    marginTop: 10,
  },
  category: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 3,
    backgroundColor: colors.secondary,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    flex: 1,
    fontFamily: fonts.LATO_REGULAR,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
  },
  username: {
    paddingHorizontal: 10,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    height: 40,
  },
  submit: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    color: colors.secondary,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 20,
    fontFamily: fonts.LATO_BOLD,
  },
});

export default ProvidersFilter;
