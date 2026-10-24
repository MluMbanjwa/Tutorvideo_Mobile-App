
import React from "react";
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  Stop,
  LinearGradient,
  RadialGradient,
} from "react-native-svg";

const TutorVideoIcon = ({
  size = 30,
  width = size,
  height = size,
  style,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 256 256"
      style={style}
      {...props}
    >
      <Defs>
        <RadialGradient
          id="blue"
          cx="32%"
          cy="16%"
          rx="90%"
          ry="90%"
        >
          <Stop offset="0" stopColor="#66f6ff" />
          <Stop offset="0.24" stopColor="#00a8ff" />
          <Stop offset="0.65" stopColor="#075be6" />
          <Stop offset="1" stopColor="#03167d" />
        </RadialGradient>

        <LinearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#c8ffff" />
          <Stop offset="0.3" stopColor="#04d8ff" />
          <Stop offset="0.7" stopColor="#0049e9" />
          <Stop offset="1" stopColor="#64eaff" />
        </LinearGradient>

        <LinearGradient id="white" x1="0" y1="0" x2="0.7" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="0.6" stopColor="#eef8ff" />
          <Stop offset="1" stopColor="#a9c5ed" />
        </LinearGradient>

        <LinearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#8db8ec" />
        </LinearGradient>

        <LinearGradient id="orange" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fff66c" />
          <Stop offset="0.5" stopColor="#ffc900" />
          <Stop offset="1" stopColor="#ff6500" />
        </LinearGradient>

        <LinearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
          <Stop
            offset="0"
            stopColor="#ffffff"
            stopOpacity={0.65}
          />
          <Stop
            offset="1"
            stopColor="#ffffff"
            stopOpacity={0}
          />
        </LinearGradient>
      </Defs>

      {/* Blue circular background */}
      <Circle
        cx="128"
        cy="128"
        r="125"
        fill="url(#blue)"
        stroke="#052bba"
        strokeWidth={2}
      />

      <Circle
        cx="128"
        cy="128"
        r="121"
        fill="none"
        stroke="url(#rim)"
        strokeWidth={5}
      />

      <Circle
        cx="128"
        cy="128"
        r="114"
        fill="none"
        stroke="#a4faff"
        strokeOpacity={0.65}
        strokeWidth={1.5}
      />

      {/* Glossy highlight */}
      <Path
        d="M22 103 C24 44 74 15 128 15 C182 15 224 48 234 103 C193 49 72 34 22 103Z"
        fill="url(#shine)"
        opacity={0.55}
      />

      <G>
        {/* Graduate body */}
        <Path
          d="M82 151 Q88 126 106 125 L149 125 Q170 132 175 153Z"
          fill="url(#white)"
          stroke="#8eadd9"
          strokeWidth={1.5}
        />

        {/* Head */}
        <Circle
          cx="124"
          cy="98"
          r="32"
          fill="url(#white)"
          stroke="#477cc8"
          strokeWidth={1.6}
        />

        {/* Graduation cap */}
        <Path
          d="M74 65 L126 39 Q128 38 131 40 L179 64 Q182 66 178 69 L130 94 Q127 96 124 94 L74 70 Q70 68 74 65Z"
          fill="url(#white)"
          stroke="#7ba3dc"
          strokeWidth={1.5}
        />

        <Path
          d="M92 78 L92 94 Q125 117 156 94 L156 79 L130 94 Q127 96 124 94Z"
          fill="url(#white)"
          stroke="#6893cf"
          strokeWidth={1.4}
        />

        {/* Tassel */}
        <Path
          d="M80 69 L80 99"
          stroke="#f5faff"
          strokeWidth={4}
          strokeLinecap="round"
        />

        <Circle cx="80" cy="98" r="4" fill="#ffffff" />

        <Path
          d="M80 98 Q75 108 73 117 Q80 125 87 117 Q85 108 80 98Z"
          fill="url(#white)"
        />

        {/* Chat bubble */}
        <Path
          d="M183 85 H218 Q234 85 234 102 V113 Q234 130 217 130 H201 L190 140 V129 H183 Q168 128 168 113 V102 Q168 85 183 85Z"
          fill="url(#white)"
          stroke="#8baedc"
          strokeWidth={1.5}
        />

        {[182, 199, 216].map((cx) => (
          <Circle
            key={cx}
            cx={cx}
            cy="108"
            r="6"
            fill="#0064dd"
            stroke="#0038ae"
            strokeWidth={0.7}
          />
        ))}

        {/* Laptop screen */}
        <Path
          d="M70 148 H181 Q187 148 185 156 L175 204 Q174 208 169 208 H82 Q77 208 76 203 L65 157 Q63 148 70 148Z"
          fill="url(#screen)"
          stroke="#d6ecff"
          strokeWidth={2}
        />

        {/* Laptop base */}
        <Path
          d="M59 201 H193 Q199 201 197 207 Q195 211 189 211 H63 Q56 211 54 207 Q52 202 59 201Z"
          fill="url(#white)"
          stroke="#89b5e6"
          strokeWidth={1}
        />

        {/* Play button */}
        <Path
          d="M112 160 Q112 156 116 156 Q119 156 122 158 L146 173 Q152 177 146 182 L122 197 Q111 203 110 193 L110 166 Q110 162 112 160Z"
          fill="#fff7a6"
          stroke="#ff6a00"
          strokeWidth={3}
        />

        <Path
          d="M116 162 L143 178 L116 194Z"
          fill="url(#orange)"
          stroke="#ffb900"
          strokeWidth={1.5}
        />
      </G>
    </Svg>
  );
};

export default TutorVideoIcon;
