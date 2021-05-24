import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import colors from "../../../constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from "react-native-picker-select";
import {
  getActivityList,
  addANewTreatment,
} from "../../../redux/actions/homeScreenActions";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Checkbox, Chip, RadioButton } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { useSelector, useDispatch } from "react-redux";
import { getAbout } from "../../../redux/actions/profileActions";
import DatePicker from "../../../components/common/datePicker";
import fonts from "../../../constants/fonts";

const activityFrequencies: Array<{ key: string; value: string }> = [
  {
    key: "once_a_day",
    value: "Once a day",
  },
  {
    key: "twice_a_day",
    value: "Twice a day",
  },
  {
    key: "weekly",
    value: "Weekly",
  },
  {
    key: "monthly",
    value: "Monthly",
  },
];

const AddNewTreatmentModal = (props: any) => {
  const { selectedCircle, userData, role } = useSelector(
    (state: any) => state.app
  );
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const dispatch = useDispatch();

  const [kind, setKind] = useState(0);
  const [type, setType] = useState("Medication");

  const [activity, setActivity] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<any>();
  const [activities, setActivities] = useState<Array<any>>([]);

  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>(null);

  const [showCalendar1, setCalendarShow1] = useState(false);
  const [showCalendar2, setCalendarShow2] = useState(false);

  const [ongoing, setOngoing] = useState(false);

  const [sideEffect, setSideEffect] = useState<Array<any>>([]);
  const [sideEffectsList, setSideEffectsList] = useState("");

  const [sliderColor, setSliderColor] = useState("red");
  const [sliderValue, setSliderValue] = useState(0);

  const [errors, setErrors] = useState<any>({});
  const [activityFrequency, setactivityFrequency] = useState<any>({});

  useEffect(() => {
    // (async () => {
    //     await getTreatmentNameSuggestions();
    // })();
  }, [activity]);

  const getTreatmentNameSuggestions = async () => {
    if (!(selectedActivity && selectedActivity["display_name"] === activity)) {
      if (activity && activity.trim().length) {
        const res = await getActivityList(activity, selectedCircle.id, type);
        if (res) {
          let _activities: any = [];
          Object.keys(res).forEach((rs: any) => {
            _activities = [..._activities, ...res[rs]];
          });
          setActivities(_activities);
        } else {
          setActivities([]);
        }
      } else {
        setActivities([]);
      }
    }
  };

  const updateSelectedActivity = (activity: any) => {
    setSelectedActivity(activity);
    setActivity(activity.display_name);
    setActivities([]);
  };

  const resetItems = (val: any) => {
    setSelectedActivity([]);
    setActivity("");
    setActivities([]);
    setType(val);
  };

  const onSelectStartDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setCalendarShow1(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onSelectEndDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || endDate;
    setCalendarShow2(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const setEndDateToOnging = (val: boolean) => {
    if (val) {
      setEndDate(undefined);
    }
    setOngoing(val);
  };

  const setSlider = (val: any) => {
    switch (val) {
      case 0: {
        setSliderColor("red");
        break;
      }
      case 1: {
        setSliderColor("orange");
        break;
      }
      case 2: {
        setSliderColor("green");
        break;
      }
      default: {
        setSliderColor("red");
        break;
      }
    }
    setSliderValue(val);
  };

  const validateRequest = () => {
    let valid = true;
    const error: any = {};
    if (!selectedActivity) {
      error.activity = "Activity is required";
      valid = false;
    }
    if (!(startDate && startDate instanceof Date)) {
      error.startDate = "Start date is required";
      valid = false;
    }
    setErrors(error);
    return valid;
  };
  const createBody = () => {
    const start_date = startDate.toISOString().split("T")[0];
    const end_date = endDate ? endDate.toISOString().split("T")[0] : null;

    return {
      treatment: selectedActivity.id,
      treatment_type: type,
      user_circle: selectedCircle.id,
      user: userData.id,
      treatment_duration: [[start_date, end_date]],
      start_date,
      end_date,
      effectiveness: sliderValue * 50,
      side_effects: sideEffect,
      activity_freq:
        type === "Activity" && activityFrequency?.key
          ? activityFrequency.key
          : null,
    };
  };

  const onSave = async () => {
    const isValid = validateRequest();
    if (isValid) {
      const body = createBody();
      try {
        await dispatch(addANewTreatment(body));
        if (props.edit) {
          dispatch(getAbout(userData.id, selectedCircle.id, role));
        }
        closeModal();
      } catch (error) {
        Alert.alert("Oops", error.message);
      }
    }
  };

  const closeModal = () => {
    setKind(0);
    setType("Medication");
    setActivity("");
    setSelectedActivity("");
    setActivities([]);
    setStartDate(null);
    setEndDate(null);
    setCalendarShow1(false);
    setCalendarShow2(false);
    setOngoing(false);
    setSideEffect([]);
    setSideEffectsList("");
    setSliderColor("red");
    setSliderValue(0);
    setactivityFrequency({});
    setErrors({});
    props.setModalVisible(false);
  };

  return (
    <Modal
      transparent={true}
      onRequestClose={() => closeModal()}
      animationType="slide"
      visible={props.modalVisible}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Add a Treatment or Procedure
              </Text>
              <MaterialIcons
                onPress={() => closeModal()}
                size={25}
                name="close"
              />
            </View>
            <ScrollView nestedScrollEnabled={true} style={styles.modalContent}>
              <View style={{ ...styles.toggleWrapper, borderColor: color }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{
                    ...styles.toggleContainer,
                    backgroundColor: kind ? colors.secondary : color,
                  }}
                  onPress={() => {
                    setKind(0);
                  }}
                >
                  <Text
                    style={{
                      ...styles.toggleText,
                      color: kind ? color : colors.secondary,
                    }}
                  >
                    For {selectedCircle.condition_type}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{
                    ...styles.toggleContainer,
                    backgroundColor: kind ? color : colors.secondary,
                  }}
                  onPress={() => {
                    setKind(1);
                  }}
                >
                  <Text
                    style={{
                      ...styles.toggleText,
                      color: kind ? colors.secondary : color,
                    }}
                  >
                    Others
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputHolder}>
                  <Text style={styles.label}>Type</Text>
                  <RNPickerSelect
                    onValueChange={(value) => resetItems(value)}
                    placeholder={{}}
                    style={{
                      inputAndroid: {
                        ...styles.inputField,
                      },
                      inputIOS: {
                        ...styles.inputField,
                      },
                      iconContainer: {
                        top: 9,
                        right: 5,
                        elevation: 3,
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                    value={type}
                    items={[
                      { label: "Medication", value: "Medication" },
                      { label: "Procedure", value: "Procedure" },
                      { label: "Activity", value: "Activity" },
                    ]}
                    Icon={() => {
                      return (
                        <MaterialIcons
                          size={30}
                          name="keyboard-arrow-down"
                          color={color}
                        />
                      );
                    }}
                  />
                </View>
                <View style={styles.inputHolder}>
                  <Text style={styles.label}>Name of {type}?</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.inputField}
                      placeholder={`Search ${type}`}
                      keyboardType="default"
                      maxLength={50}
                      autoCapitalize="none"
                      onChangeText={(value: any) => setActivity(value)}
                      value={activity}
                      returnKeyType="next"
                    />
                    <MaterialIcons
                      onPress={async () => {
                        await getTreatmentNameSuggestions();
                      }}
                      name="search"
                      size={25}
                      style={{ marginLeft: -35, elevation: 3 }}
                      color={
                        selectedCircle.color_code
                          ? selectedCircle.color_code
                          : colors.mainColor
                      }
                    />
                  </View>
                  {errors.activity ? (
                    <Text style={styles.error}>{errors.activity}</Text>
                  ) : null}

                  {activities && activities.length ? (
                    <View style={styles.responseHolder}>
                      <ScrollView nestedScrollEnabled={true}>
                        {activities.map((activity: any) => (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              updateSelectedActivity(activity);
                            }}
                            key={activity.id}
                            style={{
                              width: "100%",
                              paddingHorizontal: 10,
                              paddingVertical: 15,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fonts.LATO_REGULAR,
                                color: "#444",
                              }}
                            >
                              {activity?.display_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ) : null}
                </View>
                <View style={styles.inputHolder}>
                  <Text style={styles.label}>{type} Dates</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "48%" }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          ...styles.inputField,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onPress={() => setCalendarShow1(true)}
                      >
                        {startDate ? (
                          <Text style={{ ...styles.value, flex: 1 }}>
                            {new Date(startDate).toDateString()}
                          </Text>
                        ) : (
                          <Text style={styles.placeholder}>
                            {type === "Procedure" ? "Procedure Date" : "From"}
                          </Text>
                        )}
                        <AntDesign
                          name="calendar"
                          size={20}
                          style={{}}
                          color={
                            selectedCircle.color_code
                              ? selectedCircle.color_code
                              : colors.mainColor
                          }
                        />
                      </TouchableOpacity>
                      {showCalendar1 && (
                        <DatePicker
                          key="d1"
                          testID="dateTimePicker"
                          value={startDate ? startDate : new Date()}
                          mode="date"
                          display="calendar"
                          onChange={onSelectStartDate}
                          modal
                          maximumDate={endDate}
                          visible={showCalendar1}
                          onClose={setCalendarShow1}
                        />
                      )}
                      {errors.startDate ? (
                        <Text style={styles.error}>{errors.startDate}</Text>
                      ) : null}
                    </View>
                    {type === "Procedure" ? null : (
                      <View style={{ width: "48%" }}>
                        <TouchableOpacity
                          disabled={ongoing}
                          activeOpacity={0.8}
                          style={{
                            ...styles.inputField,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: ongoing
                              ? "#f2f2f2"
                              : colors.secondary,
                          }}
                          onPress={() => setCalendarShow2(true)}
                        >
                          {endDate ? (
                            <Text style={{ ...styles.value, flex: 1 }}>
                              {new Date(endDate).toDateString()}
                            </Text>
                          ) : (
                            <Text style={styles.placeholder}>To</Text>
                          )}
                          <AntDesign
                            name="calendar"
                            size={20}
                            color={
                              selectedCircle.color_code
                                ? selectedCircle.color_code
                                : colors.mainColor
                            }
                          />
                        </TouchableOpacity>
                        {showCalendar2 && (
                          <DatePicker
                            key="d2"
                            testID="dateTimePicker"
                            value={endDate ? endDate : new Date()}
                            mode="date"
                            display="calendar"
                            onChange={onSelectEndDate}
                            modal
                            minimumDate={startDate}
                            visible={showCalendar2}
                            onClose={setCalendarShow2}
                          />
                        )}
                      </View>
                    )}
                  </View>
                  {type === "Procedure" ? null : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Checkbox.Android
                        accessibilityStates
                        status={ongoing ? "checked" : "unchecked"}
                        onPress={() => {
                          setEndDateToOnging(!ongoing);
                        }}
                        color={
                          selectedCircle.color_code
                            ? selectedCircle.color_code
                            : colors.mainColor
                        }
                      />
                      <Text
                        style={{
                          fontFamily: fonts.LATO_REGULAR,
                          color: "#444",
                          fontSize: 14,
                        }}
                      >
                        Currently Using
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.inputHolder}>
                  <Text style={styles.label}>Effectiveness</Text>
                  <Slider
                    style={{ marginHorizontal: -15 }}
                    minimumValue={0}
                    maximumValue={2}
                    step={1}
                    value={sliderValue}
                    onSlidingComplete={(val) => {
                      setSlider(val);
                    }}
                    thumbTintColor={sliderColor}
                    minimumTrackTintColor={sliderColor}
                    maximumTrackTintColor="#000000"
                  />
                  <View style={styles.sliderTextHolder}>
                    <Text
                      style={styles.sliderText}
                      onPress={() => setSlider(0)}
                    >
                      NOT EFFECTIVE
                    </Text>
                    <Text
                      style={{ ...styles.sliderText, textAlign: "center" }}
                      onPress={() => setSlider(1)}
                    >
                      SOMEWHAT EFFECTIVE
                    </Text>
                    <Text
                      style={{ ...styles.sliderText, textAlign: "right" }}
                      onPress={() => setSlider(2)}
                    >
                      VERY EFFECTIVE
                    </Text>
                  </View>
                </View>
                {type === "Medication" ? (
                  <View style={{ ...styles.inputHolder, marginBottom: 20 }}>
                    <Text style={styles.label}>Side Effects</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {sideEffect.map((condition: string) => (
                        <Chip
                          icon="close"
                          style={{
                            margin: 3,
                            flexShrink: 1,
                            borderColor: selectedCircle.color_code
                              ? selectedCircle.color_code
                              : colors.mainColor,
                            borderWidth: 1,
                            backgroundColor: colors.secondary,
                          }}
                          accessibilityStates
                          key={condition}
                          textStyle={{ padding: 2 }}
                          onPress={() => {
                            setSideEffect((prev: any) => {
                              const state = [...prev];
                              const index = state.indexOf(condition);
                              state.splice(index, 1);
                              return state;
                            });
                          }}
                        >
                          {condition}
                        </Chip>
                      ))}
                    </View>

                    <TextInput
                      style={styles.inputField}
                      placeholder="ex. depression, anxiety etc.."
                      keyboardType="default"
                      value={sideEffectsList}
                      autoCapitalize="none"
                      maxLength={50}
                      onChangeText={(value: any) => setSideEffectsList(value)}
                      enablesReturnKeyAutomatically={true}
                      onSubmitEditing={() => {
                        if (sideEffectsList) {
                          setSideEffect((prev: any) => {
                            const state = [...prev];
                            state.push(sideEffectsList);
                            return state;
                          });
                          setSideEffectsList("");
                        }
                      }}
                      returnKeyType="done"
                    />
                  </View>
                ) : null}
                {type === "Activity" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 15,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{ fontFamily: fonts.LATO_BOLD, color: "#333" }}
                    >
                      Frequency
                    </Text>
                    <View style={{ marginTop: -7, marginLeft: 5 }}>
                      {activityFrequencies.map((rs) => (
                        <View
                          key={rs.key}
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <RadioButton.Android
                            status={
                              activityFrequency.key === rs.key
                                ? "checked"
                                : "unchecked"
                            }
                            accessibilityStates
                            value={rs.key}
                            onPress={() => {
                              setactivityFrequency(rs);
                            }}
                            color={
                              selectedCircle.color_code
                                ? selectedCircle.color_code
                                : colors.mainColor
                            }
                          />
                          <Text
                            style={{
                              fontFamily: fonts.LATO_REGULAR,
                              color: "#444",
                            }}
                          >
                            {rs.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => closeModal()}
                style={styles.btn}
              >
                <Text style={styles.btnSecondaryText}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  onSave();
                }}
                style={{ ...styles.btn, backgroundColor: color }}
              >
                <Text style={styles.btnPrimayText}>add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(0,0,0,.75)",
    flex: 1,
  },
  modalContainer: {
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: colors.secondary,
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f6f6f6",
  },
  modalHeaderText: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  modalFooter: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopColor: "#333",
    borderTopWidth: 0.5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginLeft: 15,
    backgroundColor: "#efefef",
    borderRadius: 30,
    width: 110,
  },
  btnSecondaryText: {
    color: "#6d6d6d",
    textTransform: "uppercase",
    fontSize: 14,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
  },
  btnPrimayText: {
    textTransform: "uppercase",
    fontSize: 14,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.LATO_REGULAR,
  },
  modalContent: {
    flex: 1,
  },
  toggleWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    marginHorizontal: "3%",
    justifyContent: "center",
    borderRadius: 40,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.secondary,
  },
  toggleText: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputField: {
    backgroundColor: colors.secondary,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    fontSize: 14,
    marginBottom: 5,
    fontFamily: fonts.LATO_REGULAR,
    // shadowColor: '#ccc',
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 2,
    overflow: "hidden",
    color: "#333",
  },
  label: {
    marginBottom: 5,
    fontFamily: fonts.LATO_BOLD,
  },
  inputHolder: {
    marginVertical: 5,
  },
  responseHolder: {
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 0.5,
    position: Platform.OS === "ios" ? "relative" : "absolute",
    top: Platform.OS === "ios" ? 0 : 76,
    width: "100%",
    backgroundColor: colors.secondary,
    zIndex: 10,
    maxHeight: 150,

    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  placeholder: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: fonts.LATO_REGULAR,
    paddingVertical: 4,
  },
  value: {
    fontSize: 14,
    paddingVertical: 4,
    fontFamily: fonts.LATO_REGULAR,
  },
  sliderTextHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderText: {
    fontSize: 10,
    color: "#333",
    fontFamily: fonts.LATO_BOLD,
    marginTop: 5,
    marginBottom: 10,
    flex: 1,
  },
  error: {
    marginLeft: 5,
    fontSize: 13,
    fontFamily: fonts.LATO_BOLD,
    color: "red",
  },
});

export default AddNewTreatmentModal;
