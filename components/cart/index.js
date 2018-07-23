Component({
  props:{
    onSubmit: (data) => console.log(data),
    count: 0,
    price: 0
  },
  didUpdate(prevProps,prevData){},
  didUnmount(){},
  methods:{
    onSubmit(ev){
      this.props.onSubmit()
    },
  },
})