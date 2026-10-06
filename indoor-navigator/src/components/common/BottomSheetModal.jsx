import React, { useRef } from 'react';

import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '../../theme';

const WIN_H = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

const CLOSE_THRESHOLD = 100;
const MAX_DRAG = 400;

export default function BottomSheetModal({
  visible = true,
  onClose,
  title,
  subtitle,
  headerRight,
  children,
  maxWidth = 560,
  scrollable = true,
  style,
}) {
  const translateY = useRef(
    new Animated.Value(0)
  ).current;

  const startY = useRef(0);

  /*
   * ------------------------------------------------------------
   * CLOSE
   * ------------------------------------------------------------
   */

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: WIN_H,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose?.();
    });
  };

  /*
   * ------------------------------------------------------------
   * HANDLE
   * ------------------------------------------------------------
   *
   * IMPORTANT:
   * Only the handle has this responder.
   */

  const handlePanResponder = useRef(
    PanResponder.create({
      /*
       * Grab the handle immediately.
       */
      onStartShouldSetPanResponder: () => true,

      /*
       * Start position.
       */
      onPanResponderGrant: () => {
        startY.current = 0;
      },

      /*
       * Move sheet with finger.
       */
      onPanResponderMove: (_, gesture) => {
        /*
         * Ignore upward movement.
         */
        const y = Math.max(
          0,
          Math.min(
            MAX_DRAG,
            gesture.dy
          )
        );

        translateY.setValue(y);
      },

      /*
       * Finger released.
       */
      onPanResponderRelease: (_, gesture) => {
        const distance = Math.max(
          0,
          gesture.dy
        );

        /*
         * ------------------------------------------------------
         * TAP
         * ------------------------------------------------------
         *
         * Almost no movement means the user tapped
         * the capsule.
         */

        if (
          Math.abs(gesture.dy) < 10 &&
          Math.abs(gesture.dx) < 10
        ) {
          closeSheet();
          return;
        }

        /*
         * ------------------------------------------------------
         * DRAG DOWN
         * ------------------------------------------------------
         */

        if (
          distance >= CLOSE_THRESHOLD ||
          gesture.vy > 1
        ) {
          closeSheet();
          return;
        }

        /*
         * ------------------------------------------------------
         * NOT ENOUGH → SNAP BACK
         * ------------------------------------------------------
         */

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      },

      /*
       * Something interrupted the gesture.
       */
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  /*
   * ------------------------------------------------------------
   * BODY
   * ------------------------------------------------------------
   */

  const bodyContent = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.scrollContent}>
      {children}
    </View>
  );

  if (!visible) {
    return null;
  }

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={
          IS_IOS ? 'padding' : undefined
        }
        style={styles.backdrop}
      >

        {/* BACKDROP */}

        <Pressable
          style={styles.scrim}
          onPress={onClose}
        />

        {/* SHEET */}

        <Animated.View
          style={[
            styles.sheet,
            {
              maxWidth,
              transform: [
                {
                  translateY,
                },
              ],
            },
            style,
          ]}
        >

          {/* ================================================== */}
          {/* DRAG / CLOSE HANDLE                                */}
          {/* ================================================== */}

          <View
            {...handlePanResponder.panHandlers}
            style={styles.handleArea}
          >
            <View style={styles.handlePill} />
          </View>

          {/* ================================================== */}
          {/* HEADER                                             */}
          {/* ================================================== */}

          {(title || subtitle || headerRight) && (
            <View style={styles.header}>

              <View style={styles.headerTitles}>

                {typeof title === 'string' && (
                  <Text
                    style={styles.title}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                )}

                {typeof subtitle === 'string' && (
                  <Text
                    style={styles.subtitle}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                )}

              </View>

              {headerRight}

            </View>
          )}

          {/* DIVIDER */}

          <View style={styles.divider} />

          {/* CONTENT */}

          {bodyContent}

        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}


/* ================================================================ */
/* STYLES                                                           */
/* ================================================================ */

const styles = StyleSheet.create({

  /*
   * BACKDROP
   */

  backdrop: {
    flex: 1,

    justifyContent: 'flex-end',

    alignItems: 'center',

    backgroundColor:
      theme.colors.overlay,
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
  },


  /*
   * SHEET
   */

  sheet: {
    width: '100%',

    backgroundColor:
      theme.colors.canvas,

    borderTopLeftRadius:
      theme.radius.xl,

    borderTopRightRadius:
      theme.radius.xl,

    borderWidth: 1,

    borderColor:
      theme.colors.hairline,

    borderBottomWidth: 0,

    maxHeight: Math.min(
      WIN_H * 0.50,
      680
    ),

    ...theme.shadow.card,

    overflow: 'hidden',
  },


  /*
   * HANDLE
   *
   * Large invisible touch area.
   *
   * Visible:
   *
   *        ─────
   *
   * But actual touch area:
   *
   *      ┌────────┐
   *      │ ────── │
   *      └────────┘
   */

  handleArea: {
    width: '100%',

    height: 40,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      'transparent',
  },

  handlePill: {
    width: 42,

    height: 5,

    borderRadius:
      theme.radius.pill,

    backgroundColor:
      theme.colors.hairlineStrong,
  },


  /*
   * HEADER
   */

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    paddingHorizontal: 18,

    paddingVertical: 10,

    gap: 6,
  },

  headerTitles: {
    flex: 1,

    minWidth: 0,
  },

  title: {
    color: theme.colors.ink,

    fontSize: 17,

    fontWeight: '900',

    letterSpacing: -0.2,
  },

  subtitle: {
    color:
      theme.colors.inkSubtle,

    fontSize: 12,

    fontWeight: '600',

    marginTop: 2,
  },


  /*
   * DIVIDER
   */

  divider: {
    height: 1,

    backgroundColor:
      theme.colors.hairlineTertiary,
  },


  /*
   * CONTENT
   */

  scrollView: {
    flexGrow: 0,
  },

  scrollContent: {
    paddingHorizontal: 18,

    paddingTop: 10,

    paddingBottom: 24,

    gap: 4,
  },
});