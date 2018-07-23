Component({
  data: {},
  props:{
    onClickHand: (data) => console.log(data),
  },
  didUpdate(prevProps,prevData){},
  didUnmount(){},
  methods:{
    tapHandler(ev){
      const {dataset} = ev.currentTarget
      const {id} = dataset
      this.props.onClickHand(id)
    },
  },
})