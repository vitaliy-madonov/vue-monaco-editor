<template>
  <div :style="style"></div>
</template>

<script>
var debounce = require('lodash.debounce');
var monacoLoader = require('./MonacoLoader');

module.exports = {
  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    code: { type: String, default: '// code \n' },
    srcPath: { type: String },
    language: { type: String, default: 'javascript' },
    theme: { type: String, default: 'vs-dark' }, // vs, hc-black
    options: { type: Object, default: function _default() {} },
    highlighted: { type: Array, default: function _default() {
        return [{
          number: 0,
          class: ''
        }];
      } },
    changeThrottle: { type: Number, default: 0 }
  },
  mounted: function mounted() {
    this.fetchEditor();
  },
  destroyed: function destroyed() {
    this.destroyMonaco();
  },

  computed: {
    style: function style() {
      var width = this.width,
          height = this.height;

      var fixedWidth = width.toString().indexOf('%') !== -1 ? width : width + 'px';
      var fixedHeight = height.toString().indexOf('%') !== -1 ? height : height + 'px';
      return {
        width: fixedWidth,
        height: fixedHeight
      };
    },
    editorOptions: function editorOptions() {
      return Object.assign({}, this.defaults, this.options, {
        value: this.code,
        language: this.language,
        theme: this.theme
      });
    }
  },
  data: function data() {
    return {
      defaults: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true
      }
    };
  },

  watch: {
    highlighted: {
      handler: function handler(lines) {
        this.highlightLines(lines);
      },

      deep: true
    },
    language: function language() {
      window.monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    }
  },
  methods: {
    highlightLines: function highlightLines(lines) {
      var _this = this;

      if (!this.editor) {
        return;
      }
      lines.forEach(function (line) {
        var className = line.class;
        var highlighted = _this.$el.querySelector('.' + className);

        if (highlighted) {
          highlighted.classList.remove(className);
        }

        var number = parseInt(line.number);
        if (!_this.editor && number < 1 || isNaN(number)) {
          return;
        }

        var selectedLine = _this.$el.querySelector('.view-lines [linenumber="' + number + '"]');
        if (selectedLine) {
          selectedLine.classList.add(className);
        }
      });
    },
    editorHasLoaded: function editorHasLoaded(editor, monaco) {
      var _this2 = this;

      this.editor = editor;
      this.monaco = monaco;
      this.editor.onDidChangeModelContent(function (event) {
        return _this2.codeChangeHandler(editor, event);
      });
      this.$emit('mounted', editor);
    },

    codeChangeHandler: function codeChangeHandler(editor) {
      if (this.codeChangeEmitter) {
        this.codeChangeEmitter(editor);
      } else {
        this.codeChangeEmitter = debounce(function (editor) {
          this.$emit('codeChange', editor);
        }, this.changeThrottle);
        this.codeChangeEmitter(editor);
      }
    },
    fetchEditor: function fetchEditor() {
      monacoLoader.load(this.srcPath, this.createMonaco);
    },
    createMonaco: function createMonaco() {
      this.editor = window.monaco.editor.create(this.$el, this.editorOptions);
      this.editorHasLoaded(this.editor, window.monaco);
    },
    destroyMonaco: function destroyMonaco() {
      if (typeof this.editor !== 'undefined') {
        this.editor.dispose();
      }
    }
  }
};
</script>
